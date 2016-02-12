
'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ChannelEventsBl = require('../bl/channel.events.server.bl');


function get(req, res, next){

    function cb (err, channelEvents){
        if (err) return next(err);
        if (!channelEvents) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(channelEvents);
    }

    var channel = req.channel;

    ChannelEventsBl.get(channel, req.user, req.query.date, cb);
}


exports.get     = get;