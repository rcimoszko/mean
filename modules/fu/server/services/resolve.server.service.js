'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    PickResolveBl = require('../bl/pick.resolve.server.bl'),
    EventBl = require('../bl/event.server.bl');

function checkEventTime(event, callback){

    var eventStartTime = new Date(event.startTime);
    var now = new Date();
    var diffMs = (now - eventStartTime);
    var diffHrs = Math.round((diffMs % 86400000) / 3600000);
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    diffMins = diffMins + (60*diffHrs);
    var noResolve = false;

    switch (event.sport.name){
        case 'Basketball':
            switch(event.league.name){
                case 'NCAAB':
                    if(diffMins < 120) noResolve = true;
                    break;
                default:
                    if(diffMins < 150) noResolve = true;
                    break;
            }
            break;
        case 'Baseball':
        case 'Football':
            if(diffMins < 180) noResolve = true;
            break;
        case 'Aussie Rules Football':
        case 'Aussie Rules':
        case 'Handball':
        case 'Hockey':
        case 'Rugby League':
        case 'Rugby Union':
            if(diffMins < 150) noResolve = true;
            break;
        case 'Soccer':
            if(diffMins < 120) noResolve = true;
            break;
        case 'E Sports':
            if(diffMins < 60) noResolve = true;
            break;
        case 'Mixed Martial Arts':
            if(diffMins < 30) noResolve = true;
            break;
        case 'Table Tennis':
        case 'Tennis':
        case 'Volleyball':
            if(diffMins < 90) noResolve = true;
            break;
        case 'Snooker':
        case 'Cycling':
        case 'Golf':
        case 'Darts':
        case 'Cricket':
        case 'Alpine Skiing':
        case 'Biathlon':
        case 'Ski Jumping':
        case 'Cross Country':
        case 'Formula 1':
        case 'Bobsleigh':
        case 'Figure Skating':
        case 'Freestyle Skiing':
        case 'Luge':
        case 'Nordic Combined':
        case 'Short Track':
        case 'Skeleton':
        case 'Snow Boarding':
        case 'SpeedSkating':
            if(diffMins < 120) noResolve = true;
            break;
    }
    callback(noResolve);
}

function checkEventScores(event, callback){

    var noResolve = false;

    switch (event.sport.name){
        case 'Baseball':
            break;
        case 'Aussie Rules Football':
        case 'Aussie Rules':
        case 'Football':
        case 'Basketball':
        case 'Rugby League':
        case 'Rugby Union':
            if(event.contestant1FinalScore === 0 && event.contestant2FinalScore === 0) noResolve = true;
            break;
        case 'Cricket':
            break;
        case 'Darts':
            break;
        case 'E Sports':
            if(event.contestant1FinalScore === 0 && event.contestant2FinalScore === 0) noResolve = true;
            break;
        case 'Handball':
            break;
        case 'Hockey':
            break;
        case 'Mixed Martial Arts':
            break;
        case 'Snooker':
            break;
        case 'Soccer':
            break;
        case 'Table Tennis':
            break;
        case 'Tennis':
        case 'Volleyball':
            if(event.contestant1FinalScore === 0 && event.contestant2FinalScore === 0) noResolve = true;
            break;
        case 'Golf':
            break;
        case 'Alpine Skiing':
        case 'Biathlon':
        case 'Ski Jumping':
        case 'Cross Country':
        case 'Formula 1':
        case 'Cycling':
        case 'Bobsleigh':
        case 'Figure Skating':
        case 'Freestyle Skiing':
        case 'Luge':
        case 'Nordic Combined':
        case 'Short Track':
        case 'Skeleton':
        case 'Snow Boarding':
        case 'SpeedSkating':
            break;
    }
    callback(noResolve);
}


function checkIfResolve(event, callback){

    var todo = [];

    function checkEventTime_todo(callback){
        function cb(noResolve){
            if(noResolve) return callback('No Resolve - start time');
            callback();
        }

        checkEventTime(event, cb);
    }

    function checkEventScores_todo(callback){
        function cb(noResolve){
            if(noResolve) return callback('No Resolve - scores');
            callback();
        }
        checkEventScores(event, cb);
    }

    todo.push(checkEventTime_todo);
    todo.push(checkEventScores_todo);

    async.waterfall(todo, callback);

}


function resolve(callback){
    var todo = [];

    function getUnresolvedEvents(callback){
        EventBl.getUnresolvedEvents(callback);
    }

    function resolveEvents(events, callback){

        function resolveEvent(event, callback){

            var todo = [];

            function checkResolve(callback){
                checkIfResolve(event, callback);
            }

            function resolvePicks(callback){
                console.log(event.slug);
                PickResolveBl.resolvePicks(event, callback);
            }

            todo.push(checkResolve);
            todo.push(resolvePicks);

            function cb(err){
                //if(err) console.log(err);
                callback();
            }

            async.waterfall(todo, cb);

        }

        async.eachSeries(events, resolveEvent, callback);
    }

    todo.push(getUnresolvedEvents);
    todo.push(resolveEvents);

    async.waterfall(todo, callback);

}

exports.resolve = resolve;