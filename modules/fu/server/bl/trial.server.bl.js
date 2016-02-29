'use strict';

var async = require('async');

function create(user, callback){
    var todo = [];

    if(!user.verified) return callback('Please verify email before activating trial');
    if(!user.trialUsed) return callback('Your trial has already ended');

    user.trial = true;
    user.trialStartDate = new Date();

    function cb(err){
        callback(err, user);
    }

    user.save(cb);
}


exports.create            = create;