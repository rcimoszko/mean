'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    NotificationBl = require(path.resolve('./modules/fu/server/bl/notification.server.bl')),
    UserBl = require(path.resolve('./modules/fu/server/bl/user.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Notification Id is invalid'
        });
    }

    function cb (err, notification){
        if (err) return next(err);
        if (!notification) {
            return res.status(404).send({
                message: 'Notification not found'
            });
        }
        req.notification = notification;
        next();
    }

    NotificationBl.get(id, cb);
}

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
exports.byId     = byId;