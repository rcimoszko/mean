
'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ChannelBl = require('../bl/channel.content.server.bl');


function get(req, res, next){

    function cb (err, channelContent){
        if (err) return next(err);
        if (!channelContent) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(channelContent);
    }

    var channel = req.channel;

    ChannelBl.get(channel, req.user, cb);
}


exports.get     = get;