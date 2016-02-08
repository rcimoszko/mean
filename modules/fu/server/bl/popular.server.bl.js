'use strict';

var _ = require('lodash'),
    async = require('async'),
    PickBl = require('./pick.server.bl'),
    mongoose = require('mongoose');


function getPopularGames(sportId, leagueId, count, callback){
    var todo = [];

    function groupPicks(callback){
        var query =  {result: 'Pending'};
        if(sportId !== 'all') query.sport = mongoose.Types.ObjectId(sportId);
        if(leagueId !== 'all') query.sport = mongoose.Types.ObjectId(leagueId);
        var match = {$match: query};
        var group = {$group: {'_id':  '$event', pickCount:{$sum:1}}};
        var project = {$project: {'event':  '$_id', pickCount:1}};
        var sort =  {$sort: {'pickCount': -1}};

        var aggArray = [];
        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(project);
        aggArray.push(sort);

        PickBl.aggregate(aggArray, callback);
    }


    function filterEvents(events, callback){
        events = events.splice(0, count);
        callback(null, events);
    }

    function populateEvents(events, callback){
        var populate = {path: 'event', model:'Event'};
        PickBl.populateBy(events, populate, callback);
    }

    todo.push(groupPicks);
    todo.push(filterEvents);
    todo.push(populateEvents);

    async.waterfall(todo, callback);
}


exports.getPopularGames = getPopularGames;

