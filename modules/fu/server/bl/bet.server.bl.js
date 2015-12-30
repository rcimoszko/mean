'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Bet = mongoose.model('Bet');

function populate(bet, callback){

}

function get(id, callback){

    function cb(err, bet){
        callback(err, bet);
    }

    Bet.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, bets){
        callback(err, bets);
    }

    Bet.find().exec(cb);

}

function update(data, bet, callback) {

    function cb(err){
        callback(err, bet);
    }

    bet = _.extend(bet, data);
    bet.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, bet);
    }

    var bet = new Bet(data);

    bet.save(cb);
}

function del(bet, callback){
    function cb(err){
        callback(err, bet);
    }

    bet.remove(cb);
}

function getByQuery(query, callback){
    Bet.find(query, callback);
}

function getOneByQuery(query, callback){
    Bet.findOne(query, callback);
}

exports.populate    = populate;
exports.get         = get;
exports.getAll      = getAll;
exports.create      = create;
exports.update      = update;
exports.delete      = del;
exports.getByQuery  = getByQuery;
exports.getOneByQuery  = getOneByQuery;
