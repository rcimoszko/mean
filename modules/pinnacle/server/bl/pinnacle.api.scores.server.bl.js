'use strict';

var mongoose = require('mongoose'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    PinnacleSportBl = require('./pinnacleSport.server.bl'),
    PinBetDuration = require('./pinnacle.betdurations.server.bl'),
    EventBl = require('../../../fu/server/bl/event.server.bl'),
    EventResolveBl = require('../../../fu/server/bl/event.resolve.server.bl'),
    PinnacleApiScoresInsertBl = require('./pinnacle.api.scores.insert.server.bl'),
    PinnacleLeagueBl = require('./pinnacleLeague.server.bl'),
    async = require('async');

function processEvent(scoreApi, pinnacleLeague, callback){
    var todo = [];
    var sportName = pinnacleLeague.pinnacleSport.name;
    var leagueName = pinnacleLeague.name;

    function getEvent(callback){
        var query = {pinnacleIds:scoreApi.id, startDate: {$lte: new Date()}}; //, $or:[{scores: false}, { scores: { $exists: false} }]
        EventBl.getOneByQuery(query, callback);
    }

    function processPeriods(event, callback){
        var scores = {};
        if(!event) return callback('event not found or resolved');
        console.log(event.contestant1.name + ' '+ event.contestant2.name);
        function processPeriod_loop(periodApi, callback){
            var betDuration = PinBetDuration.getBetDuration(sportName, periodApi.number);
            scores[betDuration] = {team1: periodApi.team2Score, team2: periodApi.team1Score};

            callback();
        }

        function cb(err){
            callback(err, event, scores);
        }
        async.eachSeries(scoreApi.periods, processPeriod_loop, cb);
    }

    function processScores(event, scores, callback){
        function cb(){
            callback(null, event);
        }
        var scoreType;
        if(event.pinnacleEventType && scoreApi.id in event.pinnacleEventType){
            scoreType = event.pinnacleEventType[scoreApi.id];
        }
        PinnacleApiScoresInsertBl.insertScores(event, scores, sportName, leagueName, scoreType, cb);
    }

    function insertWinner(event, callback){
        function cb(){
            callback(null, event);
        }
        EventResolveBl.assignWinner(event, cb);
    }

    function saveEvent(event, callback){
        event.save(callback);
    }

    todo.push(getEvent);
    todo.push(processPeriods);
    todo.push(processScores);
    todo.push(insertWinner);
    todo.push(saveEvent);

    function cb(err){
        if(err === 'event not found or resolved') return callback(null);
        callback(err);
    }

    async.waterfall(todo, cb);

}


function updateInsertScoresForLeague(pinnacleLeague, callback){
    var todo = [];

    function getEventsFeed(callback){
        PinApiBl.getScores(pinnacleLeague.sportId, pinnacleLeague.leagueId, pinnacleLeague.lastScores, callback);
    }

    function processEvents(results, callback){
        if(!results) return callback(null);
        if(Object.keys(results).length === 0) return callback(null);
        console.log(pinnacleLeague.name);
        pinnacleLeague.lastScores = results.last;

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
    console.log(pinnacleSport.name);

    var todo = [];

    function getActiveLeagues(callback){
        PinnacleLeagueBl.getRecentActiveLeagues(pinnacleSport, callback);
        //PinnacleLeagueBl.getByQuery({active:true, 'pinnacleSport.ref': pinnacleSport._id}, callback);
    }

    function processLeagues(pinnacleLeagues, callback){
        function proccessLeague(pinnacleLeague, callback){
            if(pinnacleLeague.useScraper) return callback(null);
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
        PinnacleSportBl.getByQuery({}, callback);
    }

    function processSports(pinnacleSports, callback){
        async.eachSeries(pinnacleSports, updateInsertScoresForSport, callback);
    }

    todo.push(getActiveSports);
    todo.push(processSports);

    async.waterfall(todo, callback);

}

exports.updateInsertAllScores = updateInsertAllScores;