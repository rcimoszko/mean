'use strict';

var mongoose = require('mongoose'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    PinnacleSportBl = require('./pinnacleSport.server.bl'),
    PinBetDuration = require('./pinnacle.betdurations.server.bl'),
    EventBl = require('../../../fu/server/bl/event.server.bl'),
    PinnacleApiScoresInsertBl = require('./pinnacle.api.scores.insert.server.bl'),
    PinnacleLeagueBl = require('./pinnacleLeague.server.bl'),
    async = require('async');

function assignWinner(event, callback){

    if(event.overtime){
        if(event.contestant1OTScore === event.contestant2OTScore){
            event.draw = true;
        } else if (event.contestant1OTScore > event.contestant2OTScore) {
            event.contestantWinner = event.contestant1;
        } else if (event.contestant2OTScore > event.contestant1OTScore){
            event.contestantWinner = event.contestant2;
        }
    } else {
        if(event.sport.name === 'Tennis'){
            if(event.contestant1SetsWon > event.contestant2SetsWon){
                event.contestantWinner = event.contestant1;
            } else if (event.contestant2SetsWon > event.contestant1SetsWon){
                event.contestantWinner = event.contestant2;
            }
        } else {
            if(event.contestant1RegulationScore && event.contestant2RegulationScore){
                if (event.contestant1RegulationScore === event.contestant2RegulationScore){
                    event.draw = true;
                } else if(event.contestant1RegulationScore > event.contestant2RegulationScore){
                    event.contestantWinner = event.contestant1;
                } else if (event.contestant2RegulationScore > event.contestant1RegulationScore){
                    event.contestantWinner = event.contestant2;
                }
            }
        }
    }
    callback();
}

function processEvent(scoreApi, pinnacleLeague, callback){
    var todo = [];
    var sportName = pinnacleLeague.pinnacleSport.name;
    var leagueName = pinnacleLeague.name;

    function getEvent(callback){
        var query = {pinnacleIds:scoreApi.id, $or:[{scores: false}, { scores: { $exists: false} }]};
        EventBl.getOneByQuery(query, callback);
    }

    function processPeriods(event, callback){
        var scores = {};

        if(!event) return callback('event not found or resolved');
        function processPeriod_loop(periodApi, callback){
            var betDuration = PinBetDuration.getBetDuration(sportName, periodApi.number);
            scores[betDuration] = {team1: periodApi.team1Score, team2: periodApi.team2Score};

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
        assignWinner(event, cb);
    }

    function saveEvent(event, callback){
        console.log(event);
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
        PinnacleSportBl.getByQuery({active:true}, callback);
    }

    function processSports(pinnacleSports, callback){
        async.eachSeries(pinnacleSports, updateInsertScoresForSport, callback);
    }

    todo.push(getActiveSports);
    todo.push(processSports);

    async.waterfall(todo, callback);

}

exports.updateInsertAllScores = updateInsertAllScores;