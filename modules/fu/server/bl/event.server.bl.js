'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    PickResolveBl = require('./pick.resolve.server.bl'),
    EventResolveBl = require('./event.resolve.server.bl'),
    LeagueBl = require('./league.server.bl'),
    PickBl = require('./pick.server.bl'),
    m_Event = mongoose.model('Event');

function populate(event, callback){

}

function get(id, callback){

    function cb(err, event){
        callback(err, event);
    }

    m_Event.findById(id).populate('league.ref').exec(cb);
}

function getBySlug(slug, callback){

    function cb(err, event){
        callback(err, event);
    }

    m_Event.findOne({slug:slug}).populate('league.ref').exec(cb);
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

function updateBy(query, update, callback){
    m_Event.update(query, update, callback);
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

    function populateBets(callback){
        function cb(err, populatedEvent){
            event = populatedEvent;
            callback(err);

        }
        populateBy(event, {path: 'pinnacleBets', model: 'Bet'}, cb);
    }

    function assignScores(callback){
        EventResolveBl.insertScores(event, data, callback);
    }

    function assignWinner(callback){
        EventResolveBl.assignWinner(event, callback);
    }

    function saveScores(callback){
        function cb(err){
            callback(err, event);
        }

        event.scores = true;
        event.save(cb);
    }

    function resolvePicks(event, callback){
        PickResolveBl.resolvePicks(event, callback);
    }

    function cb(err, event){
        callback(err, event);
    }

    todo.push(populateBets);
    todo.push(assignScores);
    todo.push(assignWinner);
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
    PickBl.getByQuery({event:event}, callback);
}

function addBet(bet, event, callback){
    m_Event.update({_id: event}, {$addToSet: {pinnacleBets: bet._id}}, callback);
}

function getUnresolvedEvents(callback){
    var query = {$or:[{resolved:false}, {resolved:{$exists:false}}], scores:true, startTime: {$lt: new Date()}};
    m_Event.find(query).populate('pinnacleBets').exec(callback);
}

function getResolveEvents(sport, callback){
    var todo = [];

    function groupPicks(callback){
        var aggArray = [];
        var query =   {$match:{result:'Pending', sport: mongoose.Types.ObjectId(sport._id), eventStartTime: {$lte: new Date()}}};
        var group =   {$group:{_id: '$event', count: {$sum:1}}};
        var project = {$project:{event: '$_id', count: 1}};

        aggArray.push(query);
        aggArray.push(group);
        aggArray.push(project);

        PickBl.aggregate(aggArray, callback);

    }

    function populateEvents(events, callback){
        var populate = {path: 'event', model:'Event'};
        populateBy(events, populate, callback);
    }


    function populateLeagues(events, callback){
        console.log(events);
        var populate = {path: 'event.league.ref', model:'League'};
        populateBy(events, populate, callback);
    }

    function sortEvents(events, callback){
        events = _.sortBy(events, function(event){
            return new Date(event.event.startTime);
        });
        callback(null, events);
    }

    todo.push(groupPicks);
    todo.push(populateEvents);
    todo.push(populateLeagues);
    todo.push(sortEvents);

    async.waterfall(todo, callback);
}


function aggregate(array, callback){
    m_Event.aggregate(array).exec(callback);
}


exports.populate    = populate;
exports.get         = get;
exports.getBySlug   = getBySlug;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.getOneByQuery  = getOneByQuery;
exports.getByLeague  = getByLeague;
exports.getForSearch  = getForSearch;
exports.populateBy  = populateBy;
exports.updateBy  = updateBy;
exports.aggregate  = aggregate;

exports.cancel      = cancel;
exports.report      = report;
exports.resolve     = resolve;
exports.reResolve   = reResolve;

exports.getDiscussion   = getDiscussion;
exports.getPicks        = getPicks;
exports.addBet          = addBet;

exports.getUnresolvedEvents = getUnresolvedEvents;
exports.getResolveEvents = getResolveEvents;