'use strict';

var mongoose = require('mongoose'),
    EventBl = require('../bl/event.server.bl'),
    errorHandler = require('../sys/error.server.sys');

function cancel(req, res) {
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
    EventBl.cancel(event, cb);
}

exports.cancel  = cancel;