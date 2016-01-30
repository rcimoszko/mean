'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    LeaderboardBl = require('../bl/leaderboard.server.bl');


function get(req, res, next){
    function cb (err, leaderboard){
        if (err) return next(err);
        if (!leaderboard) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(leaderboard);
    }

    LeaderboardBl.getLeagues(req.sport._id, cb);
}


exports.get     = get;