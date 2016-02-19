'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    NotificationBl = require(path.resolve('./modules/fu/server/bl/notification.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function read(req, res) {
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
    var notification = req.notification;

    NotificationBl.read(user, notification, cb);
}


exports.read     = read;