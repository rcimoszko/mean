'use strict';

var mongoose = require('mongoose'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    Event = mongoose.model('Event'),
    PinnacleSportBl = require('./pinnacleSport.server.bl'),
    PinnacleContestantBl = require('./pinnacleContestant.server.bl'),
    EventBl = require('../../../fu/server/bl/event.server.bl'),
    slug = require('speakingurl'),
    PinnacleLeagueBl = require('./pinnacleLeague.server.bl'),
    async = require('async');


function updateEvent(eventData, event, callback){
    var fieldsToUpdate = ['startTime', 'contestant1Pitcher', 'contestant2Pitcher'];
    var fieldChange = false;

    function updateField(field, callback){
        if(!(field in eventData)) return callback();
        if(event[field] === eventData[field]) return callback();
        event[field] = event;
        callback();
    }

    function cb(err){
        if(!fieldChange) return callback(null);
        event.save(callback);
    }

    async.each(fieldsToUpdate, updateField, cb)

}

function processEvent(scoreApi, pinnacleLeague, callback){
    console.log(scoreApi);
    callback();
    /*
    var todo = [];


    function getValues(callback){
        parseEventApi(eventApi, pinnacleLeague, callback);
    }

    function findEvent(eventData, callback){
        function cb(err, event){
            callback(err, eventData, event);
        }
        EventBl.getOneByQuery({pinnacleIds: eventData.pinnacleId}, cb);
    }

    function updateOrCreateEvent(eventData, event, callback){
        if(event){
            updateEvent(eventData, event, callback);
        } else{
            createEvent(pinnacleLeague, eventData, callback);
        }
    }

    todo.push(getValues);
    todo.push(findEvent);
    todo.push(updateOrCreateEvent);

    async.waterfall(todo, callback);
    */
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