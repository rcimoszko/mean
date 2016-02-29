'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    TrialBl = require('../bl/trial.server.bl');


function get(req, res, next){

    function cb (err, trending){
        if (err) return next(err);
        if (!trending) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(trending);
    }

    var user = req.user;

    TrialBl.get(user, cb);
}


exports.get     = get;