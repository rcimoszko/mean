'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    Pick = mongoose.model('Pick');

function populate(pick, callback){

}

function get(id, callback){

    function cb(err, pick){
        callback(err, pick);
    }

    Pick.findById(id).exec(cb);
}

function getAll(callback){

    function cb(err, picks){
        callback(err, picks);
    }

    Pick.find().exec(cb);

}

function update(data, pick, callback) {

    function cb(err){
        callback(err, pick);
    }

    pick = _.extend(pick, data);

    pick.save(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, pick);
    }

    var pick = new Pick(data);

    pick.save(cb);
}

function del(pick, callback){

    function cb(err){
        callback(err, pick);
    }

    pick.remove(cb);
}

function getByQuery(query, callback){

}


function cancelPick(pick, callback){
    var update = {
        roi: 0,
        profit: 0,
        result: 'Cancelled'
    };

    Pick.update({_id:pick}, update, callback);
}

function cancelPicksByEvent(event, callback){
    var update = {
        roi: 0,
        profit: 0,
        result: 'Cancelled'
    };

    Pick.update({event:event}, update, {multi:true}, callback);
}

exports.populate    = populate;
exports.getAll      = getAll;
exports.create      = create;
exports.delete      = del;
exports.getByQuery  = getByQuery;

exports.cancelPicksByEvent = cancelPicksByEvent;
exports.cancelPick         = cancelPick;