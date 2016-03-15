'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    EventBl = require('./event.server.bl'),
    UserBl = require('./user.server.bl'),
    PickResolveBl = require('./pick.resolve.server.bl'),
    Pick = mongoose.model('Pick');

var populate = [{path: 'event', select: '-pinnacleBets'},
                {path:'user.ref', select:'avatarUrl username'},
                {path:'league'},
                {path:'bet', model:'Bet'}];

function get(id, callback){

    function cb(err, pick){
        callback(err, pick);
    }

    Pick.findById(id).exec(cb);
}


function getBySlug(slug, callback){

    function cb(err, pick){
        callback(err, pick);
    }

    Pick.findOne({slug:slug}).exec(cb);
}

function getAll(callback){

    function cb(err, picks){
        callback(err, picks);
    }

    Pick.find().exec(cb);

}

function update(data, pick, callback) {

    function cb(err){
        callback(err, pick);
    }

    pick = _.extend(pick, data);

    pick.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, pick);
    }

    var pick = new Pick(data);

    pick.save(cb);
}

function del(pick, callback){

    function cb(err){
        callback(err, pick);
    }

    pick.remove(cb);
}

function getByQuery(query, callback){
    Pick.find(query).populate(populate).sort('eventStartTime').exec(callback);
}

function getByQueryWithOptions(query, options, callback){
    Pick.find(query, null, options).populate(populate).exec(callback);
}

function getPending(query, callback){
    Pick.find(query).populate(populate).sort('eventStartTime').exec(callback);
}

function getCompleted(query, callback){
    Pick.find(query).populate(populate).sort('-eventStartTime').limit(20).exec(callback); //limit to 20 on last 10 picks
}

function getOneByQuery(query, callback){
    Pick.findOne(query, callback);
}

function updateByQuery(query, update, options, callback){
    Pick.update(query, update, options, callback);
}

function aggregate(array, callback){
    Pick.aggregate(array).exec(callback);
}

function cancelPick(pick, callback){
    var update = {
        roi: 0,
        profit: 0,
        result: 'Cancelled'
    };

    Pick.update({_id:pick}, update, callback);
}

function cancelPicksByEvent(event, callback){

    var todo = [];

    function cancelPicks(callback){
        var update = {
            roi: 0,
            profit: 0,
            result: 'Cancelled'
        };

        function cb(err){
            callback(err);
        }

        Pick.update({event:event}, update, {multi:true}, cb);
    }

    function getPicks(callback){
        getByQuery({event:event}, callback);
    }

    function returnUnits(picks, callback){
        if(picks.length === 0) return callback();

        function returnUserUnits(pick, callback){
            UserBl.returnUnits(pick.user.ref, pick.units, callback);
        }

        async.eachSeries(picks, returnUserUnits, callback);
    }

    todo.push(cancelPicks);
    todo.push(getPicks);
    todo.push(returnUnits);

    async.waterfall(todo, callback);

}

function resolve(pick, data, callback){
    var result = data.result;
    PickResolveBl.resolve(pick, result, callback);
}

function report(pick, callback){
    callback(null);
}

function populateBy(picks, populate, callback){
    Pick.populate(picks, populate, callback);
}

function getGroupedByEvent(query, options, callback){
    var todo = [];

    function getPicksByEvent(callback){
        var aggArray = [];
        var match = {$match : query};
        var group = {$group: {'_id': '$event', picks: {$addToSet: '$$ROOT'}}};
        var project = {$project: {event: '$_id', picks: 1}};
        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(project);

        if(options.sort){
            var sort = {$sort: options.sort};
            aggArray.push(sort);
        }
        if(options.skip !== undefined){
            var skip = {$skip: options.skip};
            aggArray.push(skip);
        }
        if(options.limit){
            var limit = {$limit: options.limit};
            aggArray.push(limit);
        }

        aggregate(aggArray, callback);
    }

    function populateEvents(events, callback){
        var populate = {path: 'event', model:'Event'};
        populateBy(events, populate, callback);
    }

    todo.push(getPicksByEvent);
    todo.push(populateEvents);

    async.waterfall(todo, callback);

}

function getGroupedByUser(query, callback){
    var todo = [];

    function getPicks(callback){
        getByQuery(query, callback);
    }

    function groupByUser(picks, callback){
        picks = _.groupBy(picks, 'user.ref');
        callback(null, picks);
    }

    function groupByEvent(userPicks, callback){

        for(var userId in userPicks){
            //pull out unique events
            var picks = userPicks[userId];
            var events = _.chain(picks).pluck('event').unique().value();
            userPicks[userId] = [];
            for(var i=0; i<events.length; i++){
                var picksEvent = _.filter(picks, {event: events[i]});
                events[i] = events[i].toJSON();
                events[i].picks = picksEvent;
                userPicks[userId].push(events[i]);
            }
        }
        callback(null, userPicks);
    }

    todo.push(getPicks);
    todo.push(groupByUser);
    todo.push(groupByEvent);

    async.waterfall(todo, callback);
}


exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getBySlug   = getBySlug;

exports.getByQuery      = getByQuery;
exports.getOneByQuery   = getOneByQuery;
exports.getByQueryWithOptions   = getByQueryWithOptions;

exports.getPending = getPending;
exports.getCompleted = getCompleted;

exports.updateByQuery   = updateByQuery;
exports.aggregate       = aggregate;
exports.cancelPicksByEvent = cancelPicksByEvent;
exports.cancelPick         = cancelPick;

exports.resolve = resolve;
exports.report  = report;
exports.populateBy  = populateBy;
exports.getGroupedByEvent  = getGroupedByEvent;
exports.getGroupedByUser  = getGroupedByUser;