'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
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

    UserBl.getInfo(user, cb);
}


exports.get     = get;