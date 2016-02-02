'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    UsersProfileBl = require('../bl/users.profile.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));

function get(req, res) {
    function cb(err, profile){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(profile);
        }
    }
    var user = req.user;

    UsersProfileBl.get(user, cb);
}


exports.get     = get;