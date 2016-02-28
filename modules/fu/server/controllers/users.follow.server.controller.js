'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    FollowBl = require(path.resolve('./modules/fu/server/bl/follow.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function follow(req, res) {
    function cb(err, follow){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(follow);
        }
    }
    var followUser = req.profile;
    var user = req.user;

    FollowBl.follow(user, followUser, req.headers.host, cb);
}


exports.follow     = follow;