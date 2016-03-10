'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    PickBl = require('./pick.server.bl'),
    Sport = mongoose.model('Sport');

function populate(sport, callback){

}

function get(id, callback){

    function cb(err, sport){
        callback(err, sport);
    }

    Sport.findById(id).exec(cb);
}
function getBySlug(slug, callback){

    function cb(err, sport){
        callback(err, sport);
    }

    Sport.findOne({slug:slug}).exec(cb);
}

function getAll(callback){

    function cb(err, sports){
        callback(err, sports);
    }

    Sport.find().exec(cb);

}

function update(data, sport, callback) {

    function cb(err){
        callback(err, sport);
    }

    sport = _.extend(sport, data);

    sport.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, sport);
    }

    var sport = new Sport(data);

    sport.save(cb);
}

function del(sport, callback){

    function cb(err){
        callback(err, sport);
    }

    sport.remove(cb);
}

function getByQuery(query, callback){
    Sport.find(query, callback);
}

function getOneByQuery(query, callback){
    Sport.findOne(query, callback);
}

function getResolveList(callback){
    var todo = [];

    function getList(callback){
        var aggArray = [];

        var query = {$match:{eventStartTime: {$lte: new Date()}, result: 'Pending'}};
        var group = {$group:{_id: '$sport', count: {$sum:1}}};
        var project = {$project:{sport: '$_id', count: 1}};

        aggArray.push(query);
        aggArray.push(group);
        aggArray.push(project);

        PickBl.aggregate(aggArray, callback);
    }

    function populateList(events, callback){
        var populate = {path: 'sport', model: 'Sport'};
        PickBl.populateBy(events, populate, callback);
    }

    todo.push(getList);
    todo.push(populateList);

    async.waterfall(todo, callback);
}


exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.getBySlug   = getBySlug;
exports.create      = create;
exports.update      = update;
exports.delete      = del;

exports.getByQuery     = getByQuery;
exports.getOneByQuery  = getOneByQuery;

exports.getResolveList = getResolveList;