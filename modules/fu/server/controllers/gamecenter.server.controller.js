'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    GamecenterBl = require('../bl/gamecenter.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, gamecenter){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(gamecenter);
        }
    }

    var event = req.event;
    var league = req.league;
    var user = req.user;

    GamecenterBl.get(event, league, user, cb);
}


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

    GamecenterBl.getBySlug(slug, cb);
}

exports.bySlug  = bySlug;
exports.get     = get;