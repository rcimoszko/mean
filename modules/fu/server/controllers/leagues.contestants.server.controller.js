'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ContestantBl = require('../bl/contestant.server.bl');

function get(req, res, next){
    function cb (err, contestants){
        if (err) return next(err);
        if (!contestants) {
            return res.status(404).send({
                message: 'Contestants not found'
            });
        }
        res.json(contestants);
    }
    var league = req.league;
    ContestantBl.getByLeague(league, cb);
}


exports.get     = get;