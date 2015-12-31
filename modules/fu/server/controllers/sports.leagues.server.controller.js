'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    LeagueBl = require('../bl/league.server.bl');

function get(req, res, next){
    function cb (err, leagues){
        if (err) return next(err);
        if (!leagues) {
            return res.status(404).send({
                message: 'Leagues not found'
            });
        }
        res.json(leagues);
    }
    var sport = req.sport;
    LeagueBl.getBySport(sport, cb);
}


exports.get     = get;