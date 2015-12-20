'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Sportsbook = mongoose.model('Sportsbook');

function populate(sportsbook, callback){

}

function get(id, callback){

    function cb(err, sportsbook){
        callback(err, sportsbook);
    }

    Sportsbook.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, sportsbooks){
        callback(err, sportsbooks);
    }

    Sportsbook.find().exec(cb);

}

function update(data, sportsbook, callback) {

    function cb(err, sportsbook){
        callback(err, sportsbook);
    }

    sportsbook = _.extend(sportsbook, data);

    sportsbook.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, sportsbook);
    }

    var sportsbook = new Sportsbook(data);

    sportsbook.save(cb);
}

function del(sportsbook, callback){

    function cb(err){
        callback(err, sportsbook);
    }

    sportsbook.remove(cb);
}

function getByQuery(query, callback){

}


exports.populate    = populate;
exports.getAll      = getAll;
exports.create      = create;
exports.delete      = del;/**
 * Created by ryancimoszko on 15-12-19.
 */
