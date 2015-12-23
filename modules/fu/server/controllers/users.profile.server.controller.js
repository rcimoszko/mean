'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserProfileBl = require('../bl/user.profile.server.bl');


function get(req, res, next){
    function cb (err, userProfile){
        if (err) return next(err);
        if (!userProfile) {
            return res.status(404).send({
                message: 'User not found'
            });
        }
        res.json(userProfile);
    }
    var user = req.user;
    UserProfileBl.get(user, cb);
}


exports.get     = get;