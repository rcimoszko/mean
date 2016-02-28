'use strict';

var nodemailer = require('nodemailer'),
    async = require('async'),
    renderer = require('swig'),
    path = require('path'),
    config = require('../../../../config/config');



function renderTemplate(templatePath, json, callback){
    function cb(err, emailHTML){
        callback(err, emailHTML);
    }

    renderer.renderFile(path.resolve(templatePath), json, cb);
}

function sendEmail(emailHTML, subject, emailTo, callback){

    function cb(err){
        callback(err);
    }

    var smtpTransport = nodemailer.createTransport(config.maaxMarket.mailer.options);
    var mailOptions = {
        to: emailTo,
        from: config.maaxMarket.mailer.from,
        subject: subject,
        html: emailHTML
    };
    smtpTransport.sendMail(mailOptions, cb);

}

function sendVerificationEmail(token, user, hostName, callback) {

    var todo = [];

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/verify-email.server.view.html';
        var json = {
            user: user.username,
            url: 'https://' + hostName + '/verify/' + token
        };
        renderTemplate(templatePath, json, cb);
    }

    function send(emailHTML, callback){
        function cb(err){
            callback(err);
        }
        var subject = 'Verify Email';
        sendEmail(emailHTML, subject, user.email, cb);
    }

    function cb(err){
        console.log(err);
        if (err){
            var e = new Error('Error sending email - sendVerificationEmail');
            e.error = err;
            callback(e);
            return;
        }
        callback();
    }

    todo.push(render);
    todo.push(send);

    async.waterfall(todo, cb);

}

function sendPicksEmail(){

}

function sendFollowerEmail(user, followUserName, hostName, callback){

    var todo = [];

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/new-follower.server.view.html';
        var json = {
            user: user.username,
            followUser: followUserName,
            url: 'https://' + hostName + '/make-picks'
        };
        renderTemplate(templatePath, json, cb);
    }

    function send(emailHTML, callback){
        function cb(err){
            callback(err);
        }
        var subject = 'You Have a New Follower';
        sendEmail(emailHTML, subject, user.email, cb);
    }

    function cb(err){
        console.log(err);
        if (err){
            var e = new Error('Error sending email - sendVerificationEmail');
            e.error = err;
            callback(e);
            return;
        }
        callback();
    }

    todo.push(render);
    todo.push(send);

    async.waterfall(todo, cb);
}

function sendMessageEmail(user, userMessageName, hostName, callback){
    var todo = [];

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/new-message.server.view.html';
        var json = {
            user: user.username,
            userFollow: userMessageName,
            url: 'https://' + hostName + '/messages'
        };
        renderTemplate(templatePath, json, cb);
    }

    function send(emailHTML, callback){
        function cb(err){
            callback(err);
        }
        var subject = 'You Have a New Message';
        sendEmail(emailHTML, subject, user.email, cb);
    }

    function cb(err){
        console.log(err);
        if (err){
            var e = new Error('Error sending email - sendVerificationEmail');
            e.error = err;
            callback(e);
            return;
        }
        callback();
    }

    todo.push(render);
    todo.push(send);
}

exports.sendVerificationEmail   = sendVerificationEmail;
exports.sendFollowerEmail       = sendFollowerEmail;
exports.sendMessageEmail        = sendMessageEmail;