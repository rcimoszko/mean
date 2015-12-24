'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    User = mongoose.model('User');


function getByUsername(username, callback){

    function cb(err, user){
        callback(err, user);
    }

    User.findOne({'name':{ $regex: new RegExp(username, 'i')}}).exec(cb);
}


function getFollowing(user, callback){
    callback(null);
}

function getHub(user, callback){
    callback(null);
}

function getMessages(user, callback){
    callback(null);
}

function getNotifications(user, callback){
    callback(null);
}

function getPicks(user, callback){
    callback(null);
}

function getTracker(user, callback){
    callback(null);
}

exports.getByUsername   = getByUsername;
exports.getFollowing        = getFollowing;
exports.getHub              = getHub;
exports.getMessages         = getMessages;
exports.getNotifications    = getNotifications;
exports.getPicks            = getPicks;
exports.getTracker          = getTracker;