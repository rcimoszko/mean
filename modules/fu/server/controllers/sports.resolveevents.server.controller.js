'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    EventBl = require('../bl/event.server.bl');

function get(req, res, next){
    function cb (err, events){
        if (err) return next(err);
        if (!events) {
            return res.status(404).send({
                message: 'Sports not found'
            });
        }
        res.json(events);
    }

    var sport = req.sport;

    EventBl.getResolveEvents(sport, cb);
}


exports.get     = get;