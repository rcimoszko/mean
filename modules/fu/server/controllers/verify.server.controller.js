'use strict';

var path = require('path'),
    mongoose = require('mongoose'),
    VerificationTokenBl = require('../bl/verificationtoken.server.bl'),
    errorHandler = require(path.resolve('./modules/fu/server/sys/error.server.sys'));


function verify(req, res, next){
    function cb (err, user){
        if (err) {
            res.redirect('/verify-email-failure');
        } else {
            if(user.userReferred && user.userReferred.name){
                res.redirect('/verify-email-success/'+user.userReferred.name);
            } else{
                res.redirect('/verify-email-success');
            }
        }
    }

    var token = req.params.token;
    VerificationTokenBl.verifyToken(token, cb);
}

exports.verify    = verify;