'use strict';

var mongoose = require('mongoose'),
    async = require('async'),
    PickResolveBl = require('../bl/pick.resolve.server.bl'),
    EventBl = require('../bl/event.server.bl');


function resolve(callback){
    var todo = [];

    function getUnresolvedEvents(callback){
        EventBl.getUnresolvedEvents(callback);
    }

    function resolveEvents(events, callback){
        function resolveEvent(event, callback){
            console.log(event.slug);
            PickResolveBl.resolvePicks(event, callback);
        }

        async.eachSeries(events, resolveEvent, callback);
    }

    todo.push(getUnresolvedEvents);
    todo.push(resolveEvents);

    async.waterfall(todo, callback);

}

exports.resolve = resolve;