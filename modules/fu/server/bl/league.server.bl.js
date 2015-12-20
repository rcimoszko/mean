'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    League = mongoose.model('League');

function populate(league, callback){

}

function get(id, callback){

    function cb(err, league){
        callback(err, league);
    }

    League.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, leagues){
        callback(err, leagues);
    }

    League.find().exec(cb);

}

function update(data, league, callback) {

    function cb(err, league){
        callback(err, league);
    }

    league = _.extend(league, data);

    league.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, league);
    }

    var league = new League(data);

    league.save(cb);
}

function del(league, callback){

    function cb(err){
        callback(err, league);
    }

    league.remove(cb);
}

function getByQuery(query, callback){

}


exports.populate    = populate;
exports.getAll      = getAll;
exports.create      = create;
exports.delete      = del;