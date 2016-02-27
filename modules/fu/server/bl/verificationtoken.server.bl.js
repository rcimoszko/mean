'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    uuid = require('node-uuid'),
    User = mongoose.model('User'),
    EmailBl = require('./bet.bettype.server.bl'),
    VerificationToken = mongoose.model('VerificationToken');

function createToken(user, callback){
    var token = uuid.v4();
    var verificationToken = new VerificationToken({_userId: user._id, token: token});

    function cb(err){
        callback(err, verificationToken);
    }
    verificationToken.save(cb);
}

function resend(hostName, user, callback){
    var todo = [];

   function createToken_todo(callback){
        createToken(user, callback);
    }

    function sendEmail(token, callback){
        EmailBl.sendVerificationEmail(token.token, user, hostName, callback);
    }

    todo.push(createToken_todo);
    todo.push(sendEmail);

    function cb(err){
        var message = {message: 'An email has been sent to ' + user.email + ' with further instructions.'};
        callback(err, message);
    }

    async.waterfall(todo, cb);
}


var verifyToken = function(token, callback) {
    VerificationToken.findOne({token: token}, function(err, tokenDb){
        if (err) {
            return callback(err, null);
        }
        if(tokenDb){
            User.findById(tokenDb._userId, function(err, user) {
                if (err || !user) {
                    return callback(err);
                }
                user.verified = true;
                user.save(function(err) {
                    callback(err, user);
                });
            });
        } else {
            callback(true, null);
        }
    });
};

function verifyEmail(token, callback){
    var todo = [];

    function findToken(callback){
        VerificationToken.findOne({token: token}, callback);
    }

    function verifyUser(verificationToken, callback){
        if(!verificationToken) return callback('Token was not found or has expired');

        function cb(err, user){
            if (err || !user)  return callback(err);
            user.verified = true;
            user.save(function(err) {
                callback(err, user);
            });
        }

        User.findById(verificationToken._userId, cb);
    }

    todo.push(findToken);
    todo.push(verifyUser);

    async.waterfall(todo, callback);
}

exports.createToken = createToken;
exports.resend = resend;
exports.verifyEmail = verifyEmail;
exports.verifyToken = verifyToken;