'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    EventBl = require(path.resolve('./modules/fu/server/bl/event.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function getAll(req, res) {
    function cb(err, event){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(event);
        }
    }

    var event = req.event;

    EventBl.getPicks(event, cb);
}

exports.getAll  = getAll;