'use strict';

var mongoose = require('mongoose'),
    ContestantBl = require('../bl/contestant.server.bl'),
    errorHandler = require('../sys/error.server.sys');

function merge(req, res) {
    function cb(err, contestant){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(contestant);
        }
    }

    var contestant = req.contestant;
    var mergeContestants = req.body;
    ContestantBl.merge(contestant, mergeContestants, cb);
}

exports.merge  = merge;