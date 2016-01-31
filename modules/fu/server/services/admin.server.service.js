'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    SportBl = require('../bl/sport.server.bl'),
    LoopBl = require('../bl/loop.server.bl'),
    BetBl = require('../bl/bet.server.bl'),
    PickBl = require('../bl/pick.server.bl'),
    LeagueBl = require('../bl/league.server.bl'),
    ContestantBl = require('../bl/contestant.server.bl'),
    slug = require('speakingurl');

function assignSlugs(callback){
    var todo = [];

    function getSports(callback){
        SportBl.getAll(callback);
    }

    function processSports(sports, callback){

        function processSport(sport, callback){

            var todo = [];

            function saveSport(callback){
                sport.slug = slug(sport.name);
                sport.save(callback);
            }

            function getLeagues(sport, num, callback){
                LeagueBl.getBySport(sport, callback);
            }

            function processLeagues(leagues, callback){

                function processLeague(league, callback){

                    var todo = [];

                    function saveLeague(callback){
                        league.slug = slug(league.name);
                        console.log(league.name);
                        league.save(callback);
                    }

                    function getContestants(league, num, callback){
                        ContestantBl.getByLeague(league, callback);
                    }

                    function processContestants(contestants, callback){
                        function processContestant(contestant, callback){
                            contestant.slug = slug(contestant.name);
                            contestant.save(callback);
                        }

                        async.eachSeries(contestants, processContestant, callback);
                    }

                    todo.push(saveLeague);
                    todo.push(getContestants);
                    todo.push(processContestants);

                    async.waterfall(todo, callback);

                }
                async.eachSeries(leagues, processLeague, callback);

            }

            todo.push(saveSport);
            todo.push(getLeagues);
            todo.push(processLeagues);


            async.waterfall(todo, callback);
        }

        async.eachSeries(sports, processSport, callback);

    }

    todo.push(getSports);
    todo.push(processSports);

    async.waterfall(todo, callback);
}

function decoupleBets(callback){

    function processEvent(event, callback){

        function processBet(bet, callback){
            function cb(err, bet){
                event.pinnacleBets.push(bet);
                callback(err);
            }
            console.log(bet._id);
            bet.event = event._id;
            BetBl.create(bet, cb);
        }

        function cb(err){
            event.betsAvailable = undefined;
            event.save(callback);
        }

        async.each(event.betsAvailable, processBet, cb);
    }

    LoopBl.processEventGeneric(processEvent, callback);
}

function updateHockeyBets(callback){
    var todo = [];

    function updateOvertimeBets(callback){
        var query = {otIncluded: true, betDuration: 'game'};
        var update = {betDuration: 'game (OT included)'};
        var options = {multi: true};

        BetBl.updateByQuery(query, update, options, callback);
    }

    function updateRegBets(callback){
        var query = {otIncluded: false, betDuration: 'game'};
        var update = {betDuration: 'game (regular time)'};
        var options = {multi: true};

        BetBl.updateByQuery(query, update, options, callback);
    }

    todo.push(updateOvertimeBets);
    todo.push(updateRegBets);

    function cb(err){
        callback(err);
    }

    async.parallel(todo, cb);

}

function assignBetTypes(callback){
    var todo = [];
    var generalOrder = ['spread', 'moneyline', 'total points', 'team totals'];

    function setBetTypesForSports(callback){
        function processSport(sport, callback){
            var aggArray = [];
            var match = {$match: {sport:mongoose.Types.ObjectId(sport._id)}};
            var group = {$group: {_id: '$sport', betTypes: {$addToSet:'$betType'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, sportBetTypes){
                if(sportBetTypes.length && sportBetTypes[0].betTypes.length){
                    sport.betTypes = _.sortBy(sportBetTypes[0].betTypes, function(betType){
                        if(generalOrder.indexOf(betType) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betType);
                    });
                }
                sport.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processSportGeneric(processSport, callback);
    }

    function setBetTypesForLeagues(callback){
        function processLeague(league, callback){
            var aggArray = [];
            var match = {$match: {league:mongoose.Types.ObjectId(league._id)}};
            var group = {$group: {_id: '$league', betTypes: {$addToSet:'$betType'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, leagueBetTypes){
                if(leagueBetTypes.length && leagueBetTypes[0].betTypes.length){
                    league.betTypes = _.sortBy(leagueBetTypes[0].betTypes, function(betType){
                        if(generalOrder.indexOf(betType) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betType);
                    });
                }
                console.log(league.betTypes);
                league.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processLeagueGeneric(processLeague, callback);

    }

    todo.push(setBetTypesForSports);
    todo.push(setBetTypesForLeagues);

    async.waterfall(todo, callback);
}

function assignBetDurations(callback){

    var todo = [];
    var generalOrder = ['match', 'matchups', 'game', 'game (OT included)', 'game (regular time)', 'fight', 'series', '1st set winner', '1st 5 innings', '1st half', '2nd half', '1st period', '2nd period', '3rd period', '1st quarter', '2nd quarter', '3rd quarter', '4th quarter', 'map 1', 'map 2', 'map 3'];

    function setBetDurationsForSports(callback){
        function processSport(sport, callback){
            var aggArray = [];
            var match = {$match: {sport:mongoose.Types.ObjectId(sport._id)}};
            var group = {$group: {_id: '$sport', betDurations: {$addToSet:'$betDuration'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, sportBetDurations){
                if(sportBetDurations.length && sportBetDurations[0].betDurations.length){
                    sport.betDurations = _.sortBy(sportBetDurations[0].betDurations, function(betDuration){
                        if(generalOrder.indexOf(betDuration) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betDuration);
                    });
                }
                sport.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processSportGeneric(processSport, callback);
    }

    function setBetDurationsForLeagues(callback){
        function processLeague(league, callback){
            var aggArray = [];
            var match = {$match: {league:mongoose.Types.ObjectId(league._id)}};
            var group = {$group: {_id: '$league', betDurations: {$addToSet:'$betDuration'}}};
            aggArray.push(match);
            aggArray.push(group);

            function cb(err, leagueBetDurations){
                if(leagueBetDurations.length && leagueBetDurations[0].betDurations.length){
                    league.betDurations = _.sortBy(leagueBetDurations[0].betDurations, function(betDuration){
                        if(generalOrder.indexOf(betDuration) === -1) return generalOrder.length;
                        return generalOrder.indexOf(betDuration);
                    });
                }
                console.log(league.betDurations);
                league.save(callback);
            }
            PickBl.aggregate(aggArray, cb);
        }
        LoopBl.processLeagueGeneric(processLeague, callback);

    }

    todo.push(setBetDurationsForSports);
    todo.push(setBetDurationsForLeagues);

    async.waterfall(todo, callback);

}

exports.assignSlugs         = assignSlugs;
exports.decoupleBets        = decoupleBets;
exports.updateHockeyBets    = updateHockeyBets;

exports.assignBetTypes        = assignBetTypes;
exports.assignBetDurations    = assignBetDurations;

