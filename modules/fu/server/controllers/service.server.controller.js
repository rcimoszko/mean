'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys')),
    ResolveService = require(path.resolve('./modules/fu/server/services/resolve.server.service.js')),
    PinnacleService = require(path.resolve('./modules/pinnacle/server/services/pinnacle.server.service.js'));

function getFeed(req, res) {

    function cb(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send(200);
        }
    }

    ResolveService.resolve(cb);
}

exports.getFeed     = getFeed;