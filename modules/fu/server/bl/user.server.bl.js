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


exports.getByUsername = getByUsername;