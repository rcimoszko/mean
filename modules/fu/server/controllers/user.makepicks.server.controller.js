'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserMakePicksBl = require(path.resolve('./modules/fu/server/bl/user.makepicks.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function submit(req, res) {
    function cb(err, messages){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(messages);
        }
    }

    var user = req.user;
    var eventGroup = req.body;

    UserMakePicksBl.submit(user, eventGroup, cb);
}


exports.submit     = submit;
