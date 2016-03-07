'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PinOddsBl = require('../bl/pinnacle.api.odds.server.bl'),
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
    PinOddsBl.updateInsertAllOdds(cb);
}

exports.get = get;