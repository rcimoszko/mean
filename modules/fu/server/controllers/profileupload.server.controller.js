'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl');

function upload(req, res, next){
    function cb (err, user){
        if (err) return next(err);
        if (!user) {
            return res.status(404).send({
                message: 'USer not found'
            });
        }
        res.json(user);
    }

    UserBl.uploadProfilePicture(req, cb);
}


exports.upload     = upload;
