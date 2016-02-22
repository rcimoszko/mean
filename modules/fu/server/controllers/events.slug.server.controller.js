'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    EventBl = require('../bl/event.server.bl');


function bySlug(req, res, next, slug){

    function cb (err, event){
        if (err) return next(err);
        if (!event) {
            return res.status(404).send({
                message: 'Event not found'
            });
        }
        req.event = event;
        next();
    }

    EventBl.getBySlug(slug, cb);
}

function get(req, res, next){
    res.json(req.event);
}

exports.bySlug  = bySlug;
exports.get     = get;