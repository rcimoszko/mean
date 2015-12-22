'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    PickBl = require(path.resolve('./modules/fu/server/bl/pick.server.bl')),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function resolve(req, res) {
    function cb(err, pick){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pick);
        }
    }

    var pick = req.pick;
    var data = req.body;
    PickBl.resolve(pick, data, cb);
}

exports.resolve  = resolve;