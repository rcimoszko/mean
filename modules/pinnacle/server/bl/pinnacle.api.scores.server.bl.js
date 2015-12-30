'use strict';

var mongoose = require('mongoose'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    PinnacleSportBl = require('./pinnacleSport.server.bl'),
    PinnacleLeagueBl = require('./pinnacleLeague.server.bl'),
    async = require('async');


function processEvent(scoreApi, pinnacleLeague, callback){
    console.log(scoreApi);
    callback();
}

function updateInsertScoresForLeague(pinnacleLeague, callback){
    var todo = [];

    function getEventsFeed(callback){
        PinApiBl.getScores(pinnacleLeague.sportId, pinnacleLeague.leagueId, pinnacleLeague.last, callback);
    }

    function processEvents(results, callback){
        if(!results) return callback(null);
        if(Object.keys(results).length === 0) return callback(null);
        pinnacleLeague.last = results.last;

        var scoresApi = results.leagues[0].events;

        function processEvent_loop(scoreApi, callback){
            processEvent(scoreApi, pinnacleLeague, callback);
        }

        async.eachSeries(scoresApi, processEvent_loop, callback);
    }

    function savePinnacleLeague(callback){

        pinnacleLeague.save(callback);
    }

    todo.push(getEventsFeed);
    todo.push(processEvents);
    todo.push(savePinnacleLeague);

    async.waterfall(todo, callback);
}


function updateInsertScoresForSport(pinnacleSport, callback){

    var todo = [];

    function getActiveLeagues(callback){
        PinnacleLeagueBl.getByQuery({active:true, 'pinnacleSport.ref': pinnacleSport._id}, callback);
    }

    function processLeagues(pinnacleLeagues, callback){
        function proccessLeague(pinnacleLeague, callback){
            updateInsertScoresForLeague(pinnacleLeague, callback);
        }
        async.eachSeries(pinnacleLeagues, proccessLeague, callback);
    }

    todo.push(getActiveLeagues);
    todo.push(processLeagues);

    async.waterfall(todo, callback);
}


function updateInsertAllScores(callback){
    var todo = [];

    function getActiveSports(callback){
        PinnacleSportBl.getByQuery({active:true, name: 'E Sports'}, callback);
    }

    function processSports(pinnacleSports, callback){
        async.eachSeries(pinnacleSports, updateInsertScoresForSport, callback);

    }

    todo.push(getActiveSports);
    todo.push(processSports);

    async.waterfall(todo, callback);

}

exports.updateInsertAllScores = updateInsertAllScores;