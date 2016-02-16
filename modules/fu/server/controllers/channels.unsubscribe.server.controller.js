'use strict';

var mongoose = require('mongoose'),
    SubscriptionBl = require('../bl/subscription.server.bl'),
    errorHandler = require('../sys/error.server.sys');

function unsubscribe(req, res) {
    function cb(err, channel){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(channel);
        }
    }

    var channel = req.channel;
    SubscriptionBl.unsubscribe(req.user, channel, cb);
}

exports.unsubscribe  = unsubscribe;