'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Contestant = mongoose.model('Contestant');

function populate(contestant, callback){

}

function get(id, callback){

    function cb(err, contestant){
        callback(err, contestant);
    }

    Contestant.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, contestants){
        callback(err, contestants);
    }

    Contestant.find().exec(cb);

}

function update(data, contestant, callback) {

    function cb(err, contestant){
        callback(err, contestant);
    }

    contestant = _.extend(contestant, data);

    contestant.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, contestant);
    }

    var contestant = new Contestant(data);

    contestant.save(cb);
}

function del(contestant, callback){

    function cb(err){
        callback(err, contestant);
    }

    contestant.remove(cb);
}

function getByQuery(query, callback){

}


exports.populate    = populate;
exports.getAll      = getAll;
exports.create      = create;
exports.delete      = del;