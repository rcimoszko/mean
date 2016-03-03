'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    ShareBl = require('../bl/share.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function share(req, res) {
    function cb(err, messages){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(messages);
        }
    }

    var user = req.user;

    ShareBl.share(user, cb);
}


exports.share     = share;