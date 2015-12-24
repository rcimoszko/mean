'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require(path.resolve('./modules/fu/server/bl/user.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, tracker){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(tracker);
        }
    }

    var user = req.user;

    UserBl.getTracker(user, cb);
}


exports.get     = get;