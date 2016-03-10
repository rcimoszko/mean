'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    SportBl = require('../bl/sport.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Sport Id is invalid'
        });
    }

    function cb (err, sport){
        if (err) return next(err);
        if (!sport) {
            return res.status(404).send({
                message: 'Sport not found'
            });
        }
        req.sport = sport;
        next();
    }

    SportBl.get(id, cb);
}

function bySlug(req, res, next, slug){

    function cb (err, sport){
        if (err) return next(err);
        if (!sport) {
            return res.status(404).send({
                message: 'Sport not found'
            });
        }
        req.sport = sport;
        next();
    }

    SportBl.getBySlug(slug, cb);
}

function getAll(req, res, next){

    function cb (err, sports){
        if (err) return next(err);
        if (!sports) {
            return res.status(404).send({
                message: 'Sports not found'
            });
        }
        res.json(sports);
    }


    SportBl.getByQuery(req.query, cb);

}

function get(req, res, next){
    res.json(req.sport);
}

function update(req, res, next){
    function cb (err,sport){
        if (err) return next(err);
        if (!sport) {
            return res.status(500).send({
                message: 'Failed to update Sport'
            });
        }
        res.json(sport);

    }

    var sport = req.sport;
    var data = req.body;
    SportBl.update(data, sport, cb);
}

function del(req, res, next){

    function cb (err, sport){
        if (err) return next(err);
        if (!sport) {
            return res.status(500).send({
                message: 'Failed to delete Sport'
            });
        }
        res.json(sport);
    }

    var sport = req.sport;
    SportBl.delete(sport, cb);

}

exports.byId    = byId;
exports.bySlug  = bySlug;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;