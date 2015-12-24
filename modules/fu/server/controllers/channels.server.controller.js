'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ChannelBl = require('../bl/channel.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Channel Id is invalid'
        });
    }

    function cb (err, channel){
        if (err) return next(err);
        if (!channel) {
            return res.status(404).send({
                message: 'Channel not found'
            });
        }
        req.channel = channel;
        next();
    }

    ChannelBl.get(id, cb);
}


function bySlug(req, res, next, slug){

    function cb (err, channel){
        if (err) return next(err);
        if (!event) {
            return res.status(404).send({
                message: 'Channel not found'
            });
        }
        req.channel = channel;
        next();
    }

    ChannelBl.getBySlug(slug, cb);
}

function getAll(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, channels){
        if (err) return next(err);
        if (!channels) {
            return res.status(404).send({
                message: 'Channels not found'
            });
        }
        res.json(channels);
    }


    ChannelBl.getByQuery(req.query, cb);

}

function get(req, res, next){
    res.json(req.channel);
}

function update(req, res, next){
    function cb (err,channel){
        if (err) return next(err);
        if (!channel) {
            return res.status(500).send({
                message: 'Failed to update Channel'
            });
        }
        res.json(channel);

    }

    var channel = req.channel;
    var json = req.body;
    ChannelBl.update(channel, json, cb);
}

function del(req, res, next){

    function cb (err, channel){
        if (err) return next(err);
        if (!channel) {
            return res.status(500).send({
                message: 'Failed to delete Channel'
            });
        }
        res.json(channel);
    }

    var channel = req.channel;
    ChannelBl.delete(channel, cb);

}

exports.byId    = byId;
exports.bySlug  = bySlug;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;
