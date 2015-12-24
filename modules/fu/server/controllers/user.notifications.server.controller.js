'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require(path.resolve('./modules/fu/server/bl/user.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, notifications){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(notifications);
        }
    }

    var user = req.user;

    UserBl.getNotifications(user, cb);
}


exports.get     = get;