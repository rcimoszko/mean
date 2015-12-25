'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    FollowBl = require(path.resolve('./modules/fu/server/bl/follow.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function unfollow(req, res) {
    function cb(err, follow){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(follow);
        }
    }
    var followUser = req.userProfile;
    var user = req.user;

    FollowBl.unfollow(user, followUser, cb);
}


exports.unfollow     = unfollow;