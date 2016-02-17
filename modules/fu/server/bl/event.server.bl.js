'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    PickResolveBl = require('./pick.resolve.server.bl'),
    LeagueBl = require('./league.server.bl'),
    PickBl = require('./pick.server.bl'),
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

    function cb(err){
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
    m_Event.find(query, callback);
}

function getOneByQuery(query, callback){
    m_Event.findOne(query, callback);
}

function getByLeague(league, callback){
    getByQuery({'league.ref': league._id}, callback);
}
function getForSearch(query, callback){
    m_Event.find(query).sort('-startTime').limit(5).populate('league.ref').exec(callback);
}


function populateBy(events, populate, callback){
    m_Event.populate(events, populate, callback);
}


function cancel(event, callback){
    var todo = [];

    function cancelEvent(callback){

        function cb(err){
            callback(err);
        }
        event.cancelled = true;
        event.save(cb);
    }

    function cancelPicks(callback){
        PickBl.cancelPicksByEvent(event, callback);
    }

    function cb(err){
        callback(err, event);
    }

    todo.push(cancelEvent);
    todo.push(cancelPicks);

    async.waterfall(todo, cb);

}

function resolve(event, data, callback){

    var todo = [];

    function saveScores(callback){
        event.over = true;
        event.endTime = Date.now();
        update(event, data, callback);
    }

    function resolvePicks(event, callback){
        PickResolveBl.resolvePicks(event, callback);
    }

    function cb(err){
        callback(err, event);
    }

    todo.push(saveScores);
    todo.push(resolvePicks);

    async.waterfall(todo, cb);

}

function report(event, callback){

}

function reResolve(event, callback){

}

function getDiscussion(event, callback){

}

function getPicks(event, callback){

}

function addBet(bet, event, callback){
    m_Event.update({_id: event}, {$addToSet: {pinnacleBets: bet._id}}, callback);
}

function getUnresolvedEvents(callback){
    var query = {resolved:false, scores:true};
    m_Event.find(query, callback);
}



exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.getOneByQuery  = getOneByQuery;
exports.getByLeague  = getByLeague;
exports.getForSearch  = getForSearch;
exports.populateBy  = populateBy;

exports.cancel      = cancel;
exports.report      = report;
exports.resolve     = resolve;
exports.reResolve   = reResolve;

exports.getDiscussion   = getDiscussion;
exports.getPicks        = getPicks;
exports.addBet          = addBet;

exports.getUnresolvedEvents = getUnresolvedEvents;