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
        var dayDiff = 1;
        switch (pinnacleSport.sport.name){
            case 'Cricket':
                dayDiff = 5;
                break;
        }
        var startTime = new Date();
        startTime = startTime.setDate(startTime.getDate() - dayDiff);

        var aggArray = [];

        var match = {$match: { 'sport.ref': pinnacleSport.sport.ref, startTime: {$gte: startTime}}};
        var group = {$group:{ _id: '$sport', leagues: {$addToSet: '$league.ref'}}};
        aggArray.push(match);
        aggArray.push(group);
        EventBl.aggregate(aggArray, callback);
    }

    function getPinnacleLeagues(leagueArray, callback){
        console.log(leagueArray);
        PinnacleLeague.find({league:{$in:leagueArray}}, callback);
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