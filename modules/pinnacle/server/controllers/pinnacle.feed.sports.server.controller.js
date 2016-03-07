'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PinSportsBl = require('../bl/pinnacle.api.sports.server.bl'),
    errorHandler = require(path.resolve('./modules/pinnacle/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json('done');
        }
    }
    PinSportsBl.updateInsertSports(cb);
}

exports.get = get;