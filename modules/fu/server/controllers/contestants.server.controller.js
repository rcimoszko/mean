'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ContestantBl = require('../bl/contestant.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Contestant Id is invalid'
        });
    }

    function cb (err, contestant){
        if (err) return next(err);
        if (!contestant) {
            return res.status(404).send({
                message: 'Contestant not found'
            });
        }
        req.contestant = contestant;
        next();
    }

    ContestantBl.get(id, cb);
}


function bySlug(req, res, next, slug){

    function cb (err, contestant){
        if (err) return next(err);
        if (!contestant) {
            return res.status(404).send({
                message: 'Contestant not found'
            });
        }
        req.contestant = contestant;
        next();
    }

    ContestantBl.getBySlug(slug, cb);
}

function getAll(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, contestants){
        if (err) return next(err);
        if (!contestants) {
            return res.status(404).send({
                message: 'Contestants not found'
            });
        }
        res.json(contestants);
    }


    ContestantBl.getByQuery(req.query, cb);

}

function get(req, res, next){
    res.json(req.contestant);
}

function update(req, res, next){
    function cb (err,contestant){
        if (err) return next(err);
        if (!contestant) {
            return res.status(500).send({
                message: 'Failed to update Contestant'
            });
        }
        res.json(contestant);

    }

    var contestant = req.contestant;
    var data = req.body;
    ContestantBl.update(data, contestant, cb);
}

function del(req, res, next){

    function cb (err, contestant){
        if (err) return next(err);
        if (!contestant) {
            return res.status(500).send({
                message: 'Failed to delete Contestant'
            });
        }
        res.json(contestant);
    }

    var contestant = req.contestant;
    ContestantBl.delete(contestant, cb);

}

exports.byId    = byId;
exports.bySlug  = bySlug;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;