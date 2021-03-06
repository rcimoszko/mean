'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PinnacleLeagueBl = require(path.resolve('./modules/pinnacle/server/bl/pinnacleLeague.server.bl')),
    errorHandler = require(path.resolve('./modules/pinnacle/server/sys/error.server.sys'));

function getAll(req, res) {
    function cb(err, pinnacleLeagues){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pinnacleLeagues);
        }
    }

    var pinnacleSport = req.pinnacleSport;

    PinnacleLeagueBl.getBySport(pinnacleSport, cb);
}

exports.getAll  = getAll;