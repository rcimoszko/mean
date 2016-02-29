'use strict';

var nodemailer = require('nodemailer'),
    async = require('async'),
    _ = require('lodash'),
    renderer = require('swig'),
    FollowBl = require('./follow.server.bl'),
    UserBl = require('./user.server.bl'),
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

function sendPicksEmails(picks, user, hostName, callback){

    var todo = [];
    var baseFollowerList = [];
    var premiumFollowerList = [];

    function getFollowers(callback){
        console.log('getFollowers');
        FollowBl.getFollowerListForEmails(user._id, callback);
    }

    function filterFollowerWithNotificationsOn(followers, callback){
        console.log('filterNotifications');
        followers = _.filter(followers, function(follow){
            return follow.notify === true || typeof follow.notify === 'undefined';
        });

        callback(null, followers);
    }

    function filterFollowersWithCorrectStatus(followers, callback){
        console.log('filterFollowersWithCorrectStatus');


        function checkStatus(follower){
            function cb(err, status){
                switch(status){
                    case 'lifetime premium with base':
                    case 'premium':
                    case 'old premium':
                    case 'trial':
                        premiumFollowerList.push(follower.follower.ref);
                        break;
                    case 'base':
                        baseFollowerList.push(follower.follower.ref);
                        break;

                }
            }
            UserBl.getUserStatus(follower.follower.ref, cb);
        }

        async.eachSeries(followers, checkStatus, callback);
    }

    function sendBaseEmails(callback){

        function sendEmails(follower, callback){
            sendPicksEmail_base(follower, user.username, picks, hostName, callback);
        }

        async.eachSeries(baseFollowerList, sendEmails, callback);
    }

    function sendPremiumEmails(callback){

        function sendEmails(follower, callback){
            sendPicksEmail_premium(follower, user.username, picks, hostName, callback);
        }

        async.eachSeries(baseFollowerList, sendEmails, callback);
    }


    todo.push(getFollowers);
    todo.push(filterFollowerWithNotificationsOn);
    todo.push(filterFollowersWithCorrectStatus);
    todo.push(sendBaseEmails);
    todo.push(sendPremiumEmails);

    async.waterfall(todo, callback);

}

function sendPicksEmail_base(user, pickUserName, picks, hostName, callback){
    var todo = [];

    var proPicks = _.remove(picks, {premium:true});

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/new-picks-base.server.view.html';
        var json = {
            user: user.username,
            pickUser: pickUserName,
            picks: picks,
            proPickCount: proPicks.length,
            url: 'https://' + hostName + '/profile/'+pickUserName
        };
        renderTemplate(templatePath, json, cb);
    }

    function send(emailHTML, callback){
        function cb(err){
            callback(err);
        }
        var subject = pickUserName+ ' has made New Picks';
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

function sendPicksEmail_premium(user, pickUserName, picks, hostName, callback){
    var todo = [];

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/new-picks-premium.server.view.html';
        var json = {
            user: user.username,
            pickUser: pickUserName,
            picks: picks,
            url: 'https://' + hostName + '/profile/'+pickUserName
        };
        renderTemplate(templatePath, json, cb);
    }

    function send(emailHTML, callback){
        function cb(err){
            callback(err);
        }
        var subject = pickUserName+ ' has made New Picks';
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
exports.sendPicksEmails        = sendPicksEmails;