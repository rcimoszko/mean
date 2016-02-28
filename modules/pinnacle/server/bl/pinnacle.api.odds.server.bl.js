
'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    PinnacleSportBl = require('./pinnacleSport.server.bl'),
    PinnacleSportsbookBl = require('./pinnacle.sportsbook.server.bl'),
    EventBl = require('../../../fu/server/bl/event.server.bl'),
    BetBl = require('../../../fu/server/bl/bet.server.bl'),
    HistoricalValueBl = require('../../../fu/server/bl/historicalValues.server.bl'),
    PinnacleLeagueBl = require('./pinnacleLeague.server.bl'),
    PinnacleBetDurationBl = require('./pinnacle.betdurations.server.bl'),
    async = require('async');

var contestantNums = [{num:1, homeAway: 'home', opponentHomeAway: 'away'},{num:2, homeAway:'away', opponentHomeAway: 'away'}];
var overUnders = [{overUnder: 'over', opponentOverUnder: 'under'},{overUnder: 'under', opponentOverUnder: 'over'}];

function createBet(betData, callback){
    var todo = [];

    function createBet_todo(callback){
        betData.openingOdds = betData.odds;
        switch(betData.betType){
            case 'spread':
                betData.openingSpread = betData.spread;
                break;
            case 'total points':
            case 'team totals':
                betData.openingPoints = betData.points;
                break;
        }

        function cb(err, bet){
            if(err) console.log(err);
            callback(null, bet);
        }

        BetBl.create(betData, cb);
    }

    function addBetToEvent(bet, callback){
        function cb(err){
            callback(err, bet);
        }
        EventBl.addBet(bet, bet.event, cb);
    }

    function createHistoricalValue(bet, callback){
        if(bet.altLine) return callback(null);
        var todo = [];

        function createBetTypeValue(callback){
            var valueData;
            switch(betData.betType){
                case 'spread':
                    valueData = {type: 'spread', value:bet.spread, bet:bet._id};
                    HistoricalValueBl.create(valueData, callback);
                    break;
                case 'total points':
                case 'team totals':
                    valueData = {type: 'points', value:bet.points, bet:bet._id};
                    break;
            }
            if(valueData){
                HistoricalValueBl.create(valueData, callback);
            }  else {
                callback(null, null);
            }

        }

        function createOddsValue(value, callback){
            var valueData = {type: 'odds', value:bet.odds, bet:bet._id};
            HistoricalValueBl.create(valueData, callback);
        }

        function cb(err, value){
            callback(err);
        }

        todo.push(createBetTypeValue);
        todo.push(createOddsValue);

        async.waterfall(todo, cb);

    }

    todo.push(createBet_todo);
    todo.push(addBetToEvent);
    todo.push(createHistoricalValue);

    async.waterfall(todo, callback);

}

function updateValues(type, value, bet, callback){
    var todo = [];

    function updateBetValue(callback){
        var update = {};
        update[type] = value;
        BetBl.update(bet, update, callback);
    }

    function addToHistoricalValue(callback){
        HistoricalValueBl.add(bet, type, value, callback);
    }

    todo.push(updateBetValue);
    todo.push(addToHistoricalValue);

    async.parallel(todo, callback);
}

function updateBet(bet, betData, callback){
    var todo = [];

    function updateOdds(callback){
        updateValues('odds', betData.odds, bet, callback);
    }

    function updateSpread(callback){
        updateValues('spread', betData.spread, bet, callback);
    }

    function updatePoints(callback){
        updateValues('points', betData.points, bet, callback);
    }

    if(betData.odds !== bet.odds)  todo.push(updateOdds);
    if(bet.betType === 'spread' && betData.spread !== bet.spread)  todo.push(updateSpread);
    if((bet.betType === 'team totals' || bet.betType === 'total points')  && betData.spread !== bet.spread)  todo.push(updatePoints);


    async.parallel(todo, callback);
}

function processMoneylines(oddsApi, eventPinId, initialBetData, event, callback){
    var todo = [];
    var betData = _.clone(initialBetData);
    var spreads = {};
    if(!betData.betType) betData.betType = 'moneyline';
    betData.pinnacleId = oddsApi.lineId;

    if(event.pinnacleEventType && eventPinId in event.pinnacleEventType){
        switch (event.pinnacleEventType[eventPinId]){
            case '-1.5 sets':
                betData.betType = 'sets';
                spreads.contestant1 = -1.5;
                spreads.contestant2 = 1.5;
                break;
            case '+1.5 sets':
                betData.betType = 'sets';
                spreads.contestant1 = 1.5;
                spreads.contestant2 = -1.5;
                break;
            case '-2.5 sets':
                betData.betType = 'sets';
                spreads.contestant1 = -2.5;
                spreads.contestant2 = 2.5;
                break;
            case '+2.5 sets':
                betData.betType = 'sets';
                spreads.contestant1 = 2.5;
                spreads.contestant2 = -2.5;
                break;
        }
    }


    function addUpdateContestantMl(callback){

        function processMoneyline(contestantNum, callback){

            var todo = [];
            var contestantField = 'contestant'+contestantNum.num;
            var homeAway = contestantNum.homeAway;
            var opponentHomeAway = contestantNum.opponentHomeAway;

            function initializeValues(callback){
                betData.contestant = {name: event[contestantField].name, ref: event[contestantField].ref, number: contestantNum.num};
                betData.odds = oddsApi.moneyline[homeAway];
                if(spreads) betData.spread = spreads[contestantField];
                if(oddsApi.moneyline[homeAway] > oddsApi.moneyline[opponentHomeAway]) betData.underdog = true;
                callback();
            }

            function findBet(callback){
                var query = {event:event._id, betType: betData.betType, betDuration: betData.betDuration, 'sportsbook.ref':betData.sportsbook.ref,  'contestant.ref': event[contestantField].ref };
                if(betData.spread) query.spread = betData.spread;
                BetBl.getOneByQuery(query, callback);
            }

            function updateOrCreateBet(bet, callback){
                if(bet){
                    updateBet(bet, betData, callback);
                }else{
                    createBet(betData, callback);
                }
            }

            todo.push(initializeValues);
            todo.push(findBet);
            todo.push(updateOrCreateBet);
            async.waterfall(todo, callback);
        }

        async.eachSeries(contestantNums, processMoneyline, callback);
    }

    function addUpdateDraw(callback){
        var todo = [];
        betData.contestant = undefined;
        betData.odds = oddsApi.moneyline.draw;
        betData.draw = true;

        function findBet(callback){
            var query = {event:event._id, betType: betData.betType, betDuration: betData.betDuration, 'sportsbook.ref':betData.sportsbook.ref, draw: true};
            BetBl.getOneByQuery(query, callback);
        }

        function updateOrCreateBet(bet, callback){
            if(bet){
                updateBet(bet, betData, callback);
            } else {
                createBet(betData, callback);
            }
        }

        todo.push(findBet);
        todo.push(updateOrCreateBet);
        async.waterfall(todo, callback);
    }

    todo.push(addUpdateContestantMl);
    if('draw' in oddsApi.moneyline) todo.push(addUpdateDraw);

    async.waterfall(todo, callback);
}

function processSpreads(oddsApi, initialBetData, event, callback){
    var altNumber = 0;
    var betData = _.clone(initialBetData);

    function processSpread(spreadApi, callback){

        betData.pinnacleId = oddsApi.lineId;
        if('altLineId' in spreadApi){
            altNumber++;
            betData.pinnacleAltId = spreadApi.altLineId;
            betData.altNumber = altNumber;
            betData.altLine = true;
        }

        function processContestant(contestantNum, callback){
            var todo = [];
            var contestantField = 'contestant'+contestantNum.num;
            var homeAway = contestantNum.homeAway;

            function initializeValues(callback){
                betData.odds = spreadApi[homeAway];
                betData.contestant = {name: event[contestantField].name, ref: event[contestantField].ref, number: contestantNum.num};
                if(!betData.betType) betData.betType = 'spread';
                if(homeAway === 'home'){
                    betData.spread = spreadApi.hdp;
                } else if(homeAway === 'away') {
                    betData.spread = spreadApi.hdp*-1;
                }
                callback(null);
            }

            function findBet(callback){
                var query = {event:event._id, betType: betData.betType, betDuration: betData.betDuration, 'sportsbook.ref':betData.sportsbook.ref, 'contestant.ref':event[contestantField].ref};
                if(betData.altLine) query.altNumber = betData.altNumber;

                BetBl.getOneByQuery(query, callback);
            }

            function updateOrCreateBet(bet, callback){
                if(bet){
                    updateBet(bet, betData, callback);
                } else {
                    createBet(betData, callback);
                }
            }

            todo.push(initializeValues);
            todo.push(findBet);
            todo.push(updateOrCreateBet);
            async.waterfall(todo, callback);
        }

        async.eachSeries(contestantNums, processContestant, callback);
    }

    async.eachSeries(oddsApi.spreads, processSpread, callback);

}

function processTotals(oddsApi, initialBetData, event, callback){
    var altNumber = 0;
    var betData = _.clone(initialBetData);
    betData.pinnacleId = oddsApi.lineId;

    function processTotal(totalsApi, callback){

        if('altLineId' in totalsApi){
            altNumber++;
            betData.pinnacleAltId = totalsApi.altLineId;
            betData.altNumber = altNumber;
            betData.altLine = true;
        }

        function processOverUnder(overUnder, callback){
            var todo = [];

            function initializeValues(callback){
                betData.overUnder = overUnder.overUnder;
                betData.odds = totalsApi[betData.overUnder];
                betData.points = totalsApi.points;
                if(!betData.betType) betData.betType = 'total points';
                callback(null);
            }

            function findBet(callback){
                var query = {event:event._id, betType: betData.betType,betDuration: betData.betDuration, 'sportsbook.ref':betData.sportsbook.ref, 'overUnder':betData.overUnder};
                if(betData.altLine) query.altNumber = betData.altNumber;

                BetBl.getOneByQuery(query, callback);
            }

            function updateOrCreateBet(bet, callback){
                if(bet){
                    updateBet(bet, betData, callback);
                } else {
                    createBet(betData, callback);
                }
            }

            todo.push(initializeValues);
            todo.push(findBet);
            todo.push(updateOrCreateBet);
            async.waterfall(todo, callback);
        }

        async.eachSeries(overUnders, processOverUnder, callback);
    }

    async.eachSeries(oddsApi.totals, processTotal, callback);

}

function processTeamTotals(oddsApi, initialBetData, event, callback){

    var betData = _.clone(initialBetData);
    betData.pinnacleId = oddsApi.lineId;

    function processContestants(contestantNum, callback){

        var contestantField = 'contestant'+contestantNum.num;
        var homeAway = contestantNum.homeAway;

        function processOverUnder(overUnder, callback){

            var todo = [];

            function initializeValues(callback){
                betData.contestant = {name: event[contestantField].name, ref: event[contestantField].ref, number: contestantNum.num};
                betData.overUnder = overUnder.overUnder;
                betData.odds = oddsApi.teamTotal[homeAway][betData.overUnder];
                betData.points = oddsApi.teamTotal[homeAway].points;
                if(!betData.betType) betData.betType = 'team totals';
                callback(null);
            }

            function findBet(callback){
                var query = {event:event._id, betType: betData.betType, betDuration: betData.betDuration, 'sportsbook.ref':betData.sportsbook.ref, 'overUnder':betData.overUnder, 'contestant.ref':event[contestantField].ref};
                BetBl.getOneByQuery(query, callback);
            }

            function updateOrCreateBet(bet, callback){
                if(bet){
                    updateBet(bet, betData, callback);
                } else {
                    createBet(betData, callback);
                }
            }

            todo.push(initializeValues);
            todo.push(findBet);
            todo.push(updateOrCreateBet);
            async.waterfall(todo, callback);
        }

        async.eachSeries(overUnders, processOverUnder, callback);
    }

    async.eachSeries(contestantNums, processContestants, callback);
}


function processOdds(oddsApi, eventPinId, event, pinnacleLeague, callback){

    var betDuration = PinnacleBetDurationBl.getBetDuration(pinnacleLeague.sport.name, oddsApi.number);
    var cutoffTime = new Date(oddsApi.cutoff);
    var betData = {
        event: event._id,
        sportsbook: {name: PinnacleSportsbookBl.getPinnacle().name, ref:  PinnacleSportsbookBl.getPinnacle()._id},
        betDuration: betDuration,
        cutOffTime: cutoffTime
    };

    if(event.pinnacleEventType && eventPinId in event.pinnacleEventType){
        switch (event.pinnacleEventType[eventPinId]){
            case '-1.5 sets':
            case '+1.5 sets':
            case '-2.5 sets':
            case '+2.5 sets':
                betData.betDuration = 'match';
                break;

            case 'ot included':
                if(betData.betDuration === 'game') betData.betDuration = 'game (OT included)';
                break;
            case 'regular time':
                if(betData.betDuration === 'game') betData.betDuration = 'game (regular time)';
                break;
            default:
                var betTypeInfo = event.pinnacleEventType[eventPinId]; //E Sports
                if(betTypeInfo.indexOf(',') !== -1){
                    betData.betType = betTypeInfo.split(', ')[1];
                    betData.betDuration = betTypeInfo.split(', ')[0];
                } else {
                    betData.betType = 'moneyline';
                    betData.betDuration = betTypeInfo;
                }
                if(betData.betType.toLowerCase() === 'kills'){
                    if('spreads' in oddsApi)  betData.betType = 'spread';
                    if('totals' in oddsApi)     betData.betType = 'totals';
                }
                if(betData.betDuration.toLowerCase() === 'series'){
                    betData.betType = 'sets';
                }
                break;
        }
    }

    var todo = [];

    function processMoneylines_todo(callback){
        processMoneylines(oddsApi, eventPinId, betData, event, callback);
    }
    function processSpreads_todo(callback){
        processSpreads(oddsApi, betData, event, callback);
    }
    function processTotals_todo(callback){
        processTotals(oddsApi, betData, event, callback);
    }
    function processTeamTotals_todo(callback){
        processTeamTotals(oddsApi, betData, event, callback);
    }

    if('moneyline' in oddsApi) todo.push(processMoneylines_todo);
    if('spreads' in oddsApi) todo.push(processSpreads_todo);
    if('totals' in oddsApi) todo.push(processTotals_todo);
    if('teamTotal' in oddsApi) todo.push(processTeamTotals_todo);

    async.parallel(todo, callback);

}

function processEventOdds(eventOddsApi, pinnacleLeague, callback){
    var todo = [];

    function findEvent(callback){
        EventBl.getOneByQuery({pinnacleIds: eventOddsApi.id}, callback);
    }

    function processOdds_todo(event, callback){
        if(!event) return callback('no event found');
        function processOdds_loop(oddsApi, callback){
            processOdds(oddsApi, eventOddsApi.id, event, pinnacleLeague, callback);
        }

        async.eachSeries(eventOddsApi.periods, processOdds_loop, callback);
    }

    todo.push(findEvent);
    todo.push(processOdds_todo);

    function cb(err){
        if(err === 'no event found') return callback(null);
        callback(err);
    }

    async.waterfall(todo, cb);
}

function updateInsertOddsForLeague(pinnacleLeague, callback){
    var todo = [];

    function getOddsFeed(callback){
        PinApiBl.getOdds(pinnacleLeague.sportId, pinnacleLeague.leagueId, pinnacleLeague.last, callback);
    }

    function processEventOddsFeed(results, callback){
        if(!results) return callback(null);

        pinnacleLeague.last = results.last;

        var eventsOddsApi = results.leagues[0].events;

        function processEventOdds_loop(eventOddsApi, callback){
            processEventOdds(eventOddsApi, pinnacleLeague, callback);
        }
        async.eachSeries(eventsOddsApi, processEventOdds_loop, callback);
    }

    function savePinnacleLeague(callback){

        pinnacleLeague.save(callback);
    }

    todo.push(getOddsFeed);
    todo.push(processEventOddsFeed);
    todo.push(savePinnacleLeague);

    async.waterfall(todo, callback);
}


function updateInsertOddsForSport(pinnacleSport, callback){

    var todo = [];

    function getActiveLeagues(callback){
        PinnacleLeagueBl.getByQuery({active:true, 'pinnacleSport.ref': pinnacleSport._id}, callback);
    }

    function processLeagues(pinnacleLeagues, callback){
        function proccessLeague(pinnacleLeague, callback){
            updateInsertOddsForLeague(pinnacleLeague, callback);
        }
        async.eachSeries(pinnacleLeagues, proccessLeague, callback);
    }

    todo.push(getActiveLeagues);
    todo.push(processLeagues);

    async.waterfall(todo, callback);
}


function updateInsertAllOdds(callback){
    var todo = [];

    function getActiveSports(callback){
        PinnacleSportBl.getByQuery({active:true}, callback);
    }

    function processSports(pinnacleSports, callback){
        async.eachSeries(pinnacleSports, updateInsertOddsForSport, callback);
    }

    todo.push(getActiveSports);
    todo.push(processSports);

    async.waterfall(todo, callback);

}

exports.updateInsertAllOdds = updateInsertAllOdds;