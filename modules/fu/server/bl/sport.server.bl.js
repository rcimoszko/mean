'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Sport = mongoose.model('Sport');

function populate(sport, callback){

}

function get(id, callback){

    function cb(err, sport){
        callback(err, sport);
    }

    Sport.findById(id).exec(cb);
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

}


exports.populate    = populate;
exports.getAll      = getAll;
exports.get         = get;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
