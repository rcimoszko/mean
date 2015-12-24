'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl');


function byUsername(req, res, next, username){

    function cb (err, user){
        if (err) return next(err);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    }

    UserBl.get(username, cb);
}

exports.byUsername    = byUsername;