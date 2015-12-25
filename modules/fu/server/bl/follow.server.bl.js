'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Follow = mongoose.model('Follow');


function follow(user, userFollow, callback){
    callback(null);
}

function unfollow(user, userUnfollow, callback){
    callback(null);
}

exports.follow    = follow;
exports.unfollow  = unfollow;