'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    TrialBl = require('../bl/trial.server.bl'),
    errorHandler = require('../sys/error.server.sys');

function get(req, res, next){

    function cb (err, user){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        if (!user) {
            return res.status(404).send({
                message: 'Invalid query'
            });
        }
        res.json(user);
    }

    var user = req.user;

    TrialBl.create(user, cb);
}


exports.get     = get;