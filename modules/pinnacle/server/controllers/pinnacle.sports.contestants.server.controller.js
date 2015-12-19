'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PinnacleContestantBl = require(path.resolve('./modules/pinnacle/server/bl/pinnacleContestant.server.bl')),
    errorHandler = require(path.resolve('./modules/pinnacle/server/sys/error.server.sys'));

function getAll(req, res) {
    function cb(err, pinnacleContestants){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleContestants);
        }
    }

    var pinnacleSport = req.pinnacleSport;

    PinnacleContestantBl.getBySport(pinnacleSport, cb);
}

exports.getAll  = getAll;