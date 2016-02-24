'use strict';

var mongoose = require('mongoose'),
    path = require('path'),
    _ = require('lodash'),
    EventBl = require('./event.server.bl'),
    ChannelBl = require('./channel.server.bl'),
    UserBl = require('./user.server.bl'),
    async = require('async');


function get(text, callback){
    var todo = [];

    function getEvents_todo(callback){
        var todo = [];

        function getEvents(callback){
            var today = new Date();
            var startDate = today.setDate(today.getDate() - 10);
            var dateQuery = {$gte: startDate};
            var query = {startTime: dateQuery, $or:[{'contestant2.name':{ $regex: new RegExp(text, 'i') }}, {'contestant2.name':  { $regex: new RegExp(text, 'i') }}]};
            EventBl.getForSearch(query, callback);
        }

        function processEvents(events, callback){

            var processedEvents = [];
            var index = 0;

            function processEvent(event, callback){
                var pEvent = {
                    name: event.contestant2.name +' @ '+event.contestant1.name,
                    startTime: event.startTime,
                    type: 'event',
                    slug: event.slug,
                    leagueName: event.league.name,
                    leagueSlug: event.league.ref.slug
                };
                if(index === 0) pEvent.first = true;
                index++;
                processedEvents.push(pEvent);
                callback();
            }

            function cb(err){
                callback(err, processedEvents);
            }

            async.eachSeries(events, processEvent, cb);
        }

        todo.push(getEvents);
        todo.push(processEvents);

        async.waterfall(todo, callback);

    }

    function getChannels_todo(callback){
        var todo = [];

        function getChannels(callback){
            var query = {name: { $regex: new RegExp(text, 'i') }};
            ChannelBl.getForSearch(query, callback);
        }

        function processChannels(channels, callback){
            var processedChannels = [];
            var index = 0;

            function processChannel(channel, callback){
                var pChannel = {
                    name: channel.name,
                    type: 'channel',
                    slug: channel.slug
                };
                if(index === 0) pChannel.first = true;
                index++;
                processedChannels.push(pChannel);
                callback();
            }

            function cb(err){
                callback(err, processedChannels);
            }

            async.eachSeries(channels, processChannel, cb);
        }

        todo.push(getChannels);
        todo.push(processChannels);

        async.waterfall(todo, callback);

    }

    function getUsers_todo(callback){
        var todo = [];

        function getUsers(callback){

            var query = {username: { $regex: new RegExp(text, 'i') }};
            UserBl.getForSearch(query, callback);
        }

        function processUsers(channels, callback){
            var processedUsers = [];
            var index = 0;

            function processUser(user, callback){
                var pUser = {
                    name: user.username,
                    type: 'user'
                };
                if(index === 0) pUser.first = true;
                index++;
                processedUsers.push(pUser);
                callback();
            }

            function cb(err){
                callback(err, processedUsers);
            }

            async.eachSeries(channels, processUser, cb);
        }

        todo.push(getUsers);
        todo.push(processUsers);

        async.waterfall(todo, callback);
    }

    todo.push(getEvents_todo);
    todo.push(getChannels_todo);
    todo.push(getUsers_todo);

    function cb(err, results){
        results = _.flatten(results);
        callback(err, results);
    }

    async.parallel(todo, cb);

}

function getUsers(username, callback){
    var query = {username: { $regex: new RegExp(username, 'i') }};
    UserBl.getForSearch(query, callback);
}

exports.get         = get;
exports.getUsers    = getUsers;