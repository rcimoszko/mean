'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    LeaderboardBl = require('../bl/leaderboard.server.bl');


function get(req, res, next){

    if(!Object.keys(req.query).length){
        return res.status(400).send({
            message: 'Query is required'
        });
    }

    function cb (err, leagues){
        if (err) return next(err);
        if (!leagues) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(leagues);
    }

    LeaderboardBl.getLeagues(req.query.sportId, req.query.dateId, cb);
}


exports.get     = get;