'use strict';

var async = require('async'),
    PinEventsBl = require('../bl/pinnacle.api.events.server.bl'),
    PinnacleSportBl = require('../bl/pinnacleSport.server.bl'),
    PinnacleLeagueBl = require('../bl/pinnacleLeague.server.bl'),
    PinLeaguesBl = require('../bl/pinnacle.api.leagues.server.bl'),
    PinSportsBl = require('../bl/pinnacle.api.sports.server.bl'),
    PinOddsBl = require('../bl/pinnacle.api.odds.server.bl'),
    PinScoresBl = require('../bl/pinnacle.api.scores.server.bl');


function getScores(callback){
    PinScoresBl.updateInsertAllScores(callback);
}

function sportsFeed(callback){
    var todo = [];

    function updateSports(callback){
        console.log('updateSports');
        PinSportsBl.updateInsertSports(callback);
    }

    function updateLeagues(callback){
        console.log('updateLeagues');
        PinLeaguesBl.updateInsertAllLeagues(callback);
    }

    todo.push(updateSports);
    todo.push(updateLeagues);

    async.waterfall(todo, callback);
}

function eventsFeed(callback){
    console.log('updateEvents');
    PinEventsBl.updateInsertAllEvents(callback);
}

function scoresFeed(callback){
    console.log('updateScores');
    PinScoresBl.updateInsertAllScores(callback);
}

function oddsFeed(callback){
    console.log('updateOdds');
    PinOddsBl.updateInsertAllOdds(callback);
}

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
        console.log('updateScores');
        PinScoresBl.updateInsertAllScores(callback);
    }


    todo.push(updateScores);
    todo.push(updateSports);
    todo.push(updateLeagues);
    todo.push(updateOdds);
    todo.push(updateEvents);

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
exports.getScores = getScores;
exports.assignPinnacleSports = assignPinnacleSports;

exports.sportsFeed = sportsFeed;
exports.eventsFeed = eventsFeed;
exports.scoresFeed = scoresFeed;
exports.oddsFeed = oddsFeed;