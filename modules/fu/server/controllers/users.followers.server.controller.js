'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    FollowBl = require('../bl/follow.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, follow){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(follow);
        }
    }
    var user = req.profile;

    FollowBl.getFollowerList(user._id, cb);
}


exports.get     = get;