'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    LeagueBl = require('../bl/league.server.bl');


function byId(req, res, next, id){

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'League Id is invalid'
        });
    }

    function cb (err, league){
        if (err) return next(err);
        if (!league) {
            return res.status(404).send({
                message: 'League not found'
            });
        }
        req.league = league;
        next();
    }

    LeagueBl.get(id, cb);
}

function getAll(req, res, next){
    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, leagues){
        if (err) return next(err);
        if (!leagues) {
            return res.status(404).send({
                message: 'Leagues not found'
            });
        }
        res.json(leagues);
    }


    LeagueBl.getByQuery(req.query, cb);

}

function get(req, res, next){
    res.json(req.league);
}

function update(req, res, next){
    function cb (err,league){
        if (err) return next(err);
        if (!league) {
            return res.status(500).send({
                message: 'Failed to update League'
            });
        }
        res.json(league);

    }

    var league = req.league;
    var data = req.body;
    LeagueBl.update(data, league, cb);
}

function del(req, res, next){

    function cb (err, league){
        if (err) return next(err);
        if (!league) {
            return res.status(500).send({
                message: 'Failed to delete League'
            });
        }
        res.json(league);
    }

    var league = req.league;
    LeagueBl.delete(league, cb);

}

exports.byId    = byId;
exports.getAll  = getAll;
exports.get     = get;
exports.update  = update;
exports.delete  = del;