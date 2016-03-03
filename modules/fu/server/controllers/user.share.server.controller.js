'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ShareBl = require('../bl/share.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function share(req, res) {
    function cb(err){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.send(200);
        }
    }

    var user = req.user;
    var data = req.body;

    ShareBl.share(user, data, cb);
}


exports.share     = share;