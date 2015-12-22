'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PickBl = require('../bl/pick.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Pick Id is invalid'
        });
    }

    function cb (err, pick){
        if (err) return next(err);
        if (!pick) {
            return res.status(404).send({
                message: 'Pick not found'
            });
        }
        req.pick = pick;
        next();
    }

    PickBl.get(id, cb);
}

function getAll(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, picks){
        if (err) return next(err);
        if (!picks) {
            return res.status(404).send({
                message: 'Picks not found'
            });
        }
        res.json(picks);
    }


    PickBl.getByQuery(req.query, cb);

}

function get(req, res, next){
    res.json(req.pick);
}

function update(req, res, next){
    function cb (err,pick){
        if (err) return next(err);
        if (!pick) {
            return res.status(500).send({
                message: 'Failed to update Pick'
            });
        }
        res.json(pick);

    }

    var pick = req.pick;
    var json = req.body;
    PickBl.update(pick, json, cb);
}

function del(req, res, next){

    function cb (err, pick){
        if (err) return next(err);
        if (!pick) {
            return res.status(500).send({
                message: 'Failed to delete Pick'
            });
        }
        res.json(pick);
    }

    var pick = req.pick;
    PickBl.delete(pick, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;