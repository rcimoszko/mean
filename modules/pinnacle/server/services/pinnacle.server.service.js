'use strict';

var async = require('async'),
    PinEventsBl = require('../bl/pinnacle.api.events.server.bl'),
    PinnacleSportBl = require('../bl/pinnacleSport.server.bl'),
    PinnacleLeagueBl = require('../bl/pinnacleLeague.server.bl'),
    PinLeaguesBl = require('../bl/pinnacle.api.leagues.server.bl'),
    PinSportsBl = require('../bl/pinnacle.api.sports.server.bl'),
    PinOddsBl = require('../bl/pinnacle.api.odds.server.bl'),
    PinScoresBl = require('../bl/pinnacle.api.scores.server.bl');


function runFeed(callback){
    var todo = [];

    function updateSports(callback){
        console.log('updateSports');
        PinSportsBl.updateInsertSports(callback);
    }

    function updateLeagues(callback){
        console.log('updateLeagues');
        PinLeaguesBl.updateInsertAllLeagues(callback);
    }

    function updateEvents(callback){
        console.log('updateEvents');
        PinEventsBl.updateInsertAllEvents(callback);

    }

    function updateOdds(callback){
        console.log('updateOdds');
        PinOddsBl.updateInsertAllOdds(callback);
    }


    function updateScores(callback){
        PinScoresBl.updateInsertAllScores(callback);
    }

    todo.push(updateSports);
    todo.push(updateLeagues);
    todo.push(updateEvents);
    todo.push(updateOdds);
    //todo.push(updateScores);

    async.waterfall(todo, callback);

}

function assignPinnacleSports(callback){
    var todo = [];

    function getSports(callback){
        PinnacleSportBl.getAll(callback);
    }

    function processSports(sports, callback){

        function processSport(sport, callback){

            var todo = [];

            function getLeagues(callback){
                var query = {sportId: sport.sportId};
                PinnacleLeagueBl.getByQuery(query, callback);
            }

            function processLeagues(leagues, callback){

                function processLeague(league, callback){
                    league.pinnacleSport = {name: sport.name, ref: sport._id};
                    console.log(league.name);
                    league.save(callback);
                }
                async.eachSeries(leagues, processLeague, callback);

            }

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

exports.runFeed = runFeed;
exports.assignPinnacleSports = assignPinnacleSports;