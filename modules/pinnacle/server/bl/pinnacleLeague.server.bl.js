'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    EventBl = require('../../../fu/server/bl/event.server.bl'),
    PinnacleLeague = mongoose.model('PinnacleLeague');

function populate(pinnacleLeague, callback){

}

function get(id, callback){

    function cb(err, pinnacleLeague){
        callback(err, pinnacleLeague);
    }

    PinnacleLeague.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, pinnacleLeagues){
        callback(err, pinnacleLeagues);
    }

    PinnacleLeague.find().exec(cb);

}

function update(data, pinnacleLeague, callback) {

    function cb(err, pinnacleLeague){
        callback(err, pinnacleLeague);
    }

    pinnacleLeague = _.extend(pinnacleLeague, data);

    pinnacleLeague.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, pinnacleLeague);
    }

    var pinnacleLeague = new PinnacleLeague(data);

    pinnacleLeague.save(cb);
}

function del(pinnacleLeague, callback){

    function cb(err){
        callback(err, pinnacleLeague);
    }

    pinnacleLeague.remove(cb);
}

function getBySport(pinnacleSport, callback){

    function cb(err, pinnacleLeagues){
        callback(err, pinnacleLeagues);
    }

    PinnacleLeague.find({'pinnacleSport.ref':pinnacleSport}, cb);
}

function getByQuery(query, callback){
    PinnacleLeague.find(query, callback);
}

function getOneByQuery(query, callback){
    PinnacleLeague.findOne(query, callback);
}

function getRecentActiveLeagues(pinnacleSport, callback){
    var todo = [];

    function groupRecentLeagues(callback){
        var dayDiff = 3;
        switch (pinnacleSport.sport.name){
            case 'Cricket':
            case 'Golf':
                dayDiff = 5;
                break;
        }
        var startTime = new Date();
        startTime.setDate(startTime.getDate() - dayDiff);
        var aggArray = [];

        var match = {$match: {'sport.ref': mongoose.Types.ObjectId(pinnacleSport.sport.ref), startTime: {$gte: startTime}}};
        var group = {$group: {_id: '$sport', leagues: {$addToSet: '$league.ref'}}};

        aggArray.push(match);
        aggArray.push(group);
        EventBl.aggregate(aggArray, callback);
    }

    function getPinnacleLeagues(leagueArray, callback){
        if(leagueArray.length === 0) return callback(null, []);
        PinnacleLeague.find({'league.ref':{$in:leagueArray[0].leagues}}, callback);
    }

    todo.push(groupRecentLeagues);
    todo.push(getPinnacleLeagues);

    async.waterfall(todo, callback);

}

exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getBySport    = getBySport;
exports.getOneByQuery = getOneByQuery;
exports.getByQuery    = getByQuery;

exports.getRecentActiveLeagues  = getRecentActiveLeagues;