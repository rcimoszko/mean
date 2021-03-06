'use strict';

var mongoose = require('mongoose'),
    SubscriptionBl = require('../bl/subscription.server.bl'),
    errorHandler = require('../sys/error.server.sys');

function subscribe(req, res) {
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
    SubscriptionBl.subscribe(req.user, channel, cb);
}

exports.subscribe  = subscribe;