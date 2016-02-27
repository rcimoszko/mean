'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    VerificationTokenBl = require('../bl/verificationtoken.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));


function send(req, res, next){
    function cb (err, message){
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(message);
        }
    }

    var user = req.user;
    VerificationTokenBl.resend(req.headers.host, user, cb);
}

exports.send    = send;