'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl');


function getAll(req, res, next){

    function cb (err, users){
        if (err) return next(err);
        if (!users) {
            return res.status(404).send({
                message: 'Users not found'
            });
        }
        res.json(users);
    }

    UserBl.getAll(cb);
}


function byUsername(req, res, next, username){

    function cb (err, user){
        if (err) return next(err);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }
        req.userProfile = user;
        next();
    }

    UserBl.getByUsername(username, cb);
}

exports.byUsername    = byUsername;
exports.getAll        = getAll;