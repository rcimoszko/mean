'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ProfileBl = require('../bl/profile.server.bl');


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
    ProfileBl.get(user, cb);
}


exports.get     = get;