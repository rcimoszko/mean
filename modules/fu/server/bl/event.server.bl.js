'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    m_Event = mongoose.model('Event');

function populate(event, callback){

}

function get(id, callback){

    function cb(err, event){
        callback(err, event);
    }

    m_Event.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, events){
        callback(err, events);
    }

    m_Event.find().exec(cb);

}

function update(data, event, callback) {

    function cb(err, event){
        callback(err, event);
    }

    event = _.extend(event, data);

    event.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, event);
    }

    var event = new m_Event(data);

    event.save(cb);
}

function del(event, callback){

    function cb(err){
        callback(err, event);
    }

    event.remove(cb);
}

function getByQuery(query, callback){

}

function cancel(event, callback){

}

function resolve(event, callback){

}

function report(event, callback){

}

function reResolve(event, callback){

}

function getDiscussion(event, callback){

}

function getPicks(event, callback){

}

function getGamecenter(event, callback){

}


exports.populate    = populate;
exports.getAll      = getAll;
exports.create      = create;
exports.delete      = del;
exports.getByQuery  = getByQuery;

exports.cancel      = cancel;
exports.report      = report;
exports.resolve     = resolve;
exports.reResolve   = reResolve;

exports.getDiscussion   = getDiscussion;
exports.getPicks        = getPicks;
exports.getGamecenter   = getGamecenter;