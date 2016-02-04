'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    Pick = mongoose.model('Pick');

var populate = [{path: 'event', select: '-pinnacleBets'}];

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

function getPending(query, callback){
    Pick.find(query).populate(populate).sort('eventStartTime').exec(callback);
}

function getCompleted(query, callback){
    Pick.find(query).populate(populate).sort('-eventStartTime').exec(callback);
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
    var update = {
        roi: 0,
        profit: 0,
        result: 'Cancelled'
    };

    Pick.update({event:event}, update, {multi:true}, callback);
}

function resolve(pick, callback){
    callback(null);
}

function report(pick, callback){
    callback(null);
}

function populateBy(picks, populate, callback){
    Pick.populate(picks, populate, callback);
}

function getGroupedByEvent(query, callback){

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