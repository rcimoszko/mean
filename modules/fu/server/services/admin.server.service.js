'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    SportBl = require('../bl/sport.server.bl'),
    LoopBl = require('../bl/loop.server.bl'),
    BetBl = require('../bl/bet.server.bl'),
    LeagueBl = require('../bl/league.server.bl'),
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
                    league.slug = slug(league.name);
                    console.log(league.name);
                    league.save(callback);
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
            BetBl.create(bet, cb);
        }

        function cb(err){
            delete event.betsAvailable;
            event.save(callback);
        }

        async.each(event.betsAvailable, processBet, cb);
    }

    LoopBl.processEventGeneric(processEvent, callback);
}

function updateHockeyBets(callback){
    var todo = [];

    function updateOvertimeBets(callback){
        var query = {otIncluded: true, betType: 'game'};
        var update = {betType: 'game (OT included)'};
        var options = {multi: true};

        BetBl.updateByQuery(query, update, options, callback);
    }

    function updateRegBets(callback){
        var query = {otIncluded: true, betType: 'game'};
        var update = {betType: 'game (regular time)'};
        var options = {multi: true};

        BetBl.updateByQuery(query, update, options, callback);
    }

    todo.push(updateOvertimeBets);
    todo.push(updateRegBets);

    async.waterfall(todo, callback);

}

exports.assignSlugs         = assignSlugs;
exports.decoupleBets        = decoupleBets;
exports.updateHockeyBets    = updateHockeyBets;