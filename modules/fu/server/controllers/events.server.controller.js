'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    EventBl = require('../bl/event.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Event Id is invalid'
        });
    }

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

    EventBl.get(id, cb);
}

function getAll(req, res, next){

    function cb (err, events){
        if (err) return next(err);
        if (!events) {
            return res.status(404).send({
                message: 'Events not found'
            });
        }
        res.json(events);
    }

    EventBl.getAll(cb);

}

function get(req, res, next){
    res.json(req.event);
}

function update(req, res, next){
    function cb (err,event){
        if (err) return next(err);
        if (!event) {
            return res.status(500).send({
                message: 'Failed to update Event'
            });
        }
        res.json(event);

    }

    var event = req.event;
    var json = req.body;
    EventBl.update(event, json, cb);
}

function del(req, res, next){

    function cb (err, event){
        if (err) return next(err);
        if (!event) {
            return res.status(500).send({
                message: 'Failed to delete Event'
            });
        }
        res.json(event);
    }

    var event = req.event;
    EventBl.delete(event, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;