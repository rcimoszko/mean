'use strict';

var nodemailer = require('nodemailer'),
    async = require('async'),
    _ = require('lodash'),
    renderer = require('swig'),
    FollowBl = require('./follow.server.bl'),
    UserBl = require('./user.server.bl'),
    PickBl = require('./pick.server.bl'),
    HotPickBl = require('./hotpick.server.bl'),
    config = require('../../../../config/config'),
    path = require('path');



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

function betName(bet){
    var text;
    switch(bet.betType){
        case 'spread':
            text = bet.contestant.name+' '+bet.spread;
            break;
        case 'total points':
            text = bet.overUnder+' '+bet.points;
            break;
        case 'team totals':
            text = bet.contestant.name+' '+bet.overUnder+' '+bet.points;
            break;
        case 'moneyline':
            if(bet.draw){
                text = 'Draw';
            } else {
                text = bet.contestant.name;
            }
            break;
        case 'sets':
            text = bet.contestant.name+' '+bet.spread+' sets';
            break;
        default:
            text = bet.contestant.name;
            break;

    }
    text = text +' ('+bet.betType + ' - '+bet.betDuration+') - '+bet.odds;
    return text;
}

function pickName(pick){
    var text;
    switch(pick.betType){
        case 'spread':
            text = pick.contestant.name+' '+pick.spread;
            break;
        case 'total points':
            text = pick.overUnder+' '+pick.points;
            break;
        case 'team totals':
            text = pick.contestant.name+' '+pick.overUnder+' '+pick.points;
            break;
        case 'moneyline':
            if(pick.draw){
                text = 'Draw';
            } else {
                text = pick.contestant.name;
            }
            break;
        case 'sets':
            text = pick.contestant.name+' '+pick.spread+' sets';
            break;
        default:
            text = pick.contestant.name;
            break;

    }
    text = text +' ('+pick.betType + ' - '+pick.betDuration+') - '+pick.units+'unit(s) @ '+pick.odds;
    return text;
}

function sendPicksEmails(picks, user, hostName, callback){

    var todo = [];
    var baseFollowerList = [];
    var premiumFollowerList = [];
    var processedEvents = [];

    function populatePicks(callback){
        var populate = [
            {path: 'event', model:'Event', select: '-pinnacleBets'}
        ];

        PickBl.populateBy(picks, populate, callback);
    }

    function processPicks(picks, callback){

        picks = _.sortBy(picks, 'event.startTime');

        function processPick(pick, callback){
            var eventHeader = pick.event.sport.name+' // '+pick.event.league.name+' // '+pick.event.contestant2.name+' @ '+pick.event.contestant1.name + ' // '+new Date(pick.event.startTime).toUTCString();
            var exists = false;
            for(var i=0; i<processedEvents.length; i++){
                if(processedEvents[i].header === eventHeader) {
                    exists = true;
                    break;
                }
            }

            var pPick = pick.toJSON();
            pPick.name = pickName(pPick) ;

            if(!exists){
                processedEvents.push({header:eventHeader, picks:[pPick]});
            } else {
                processedEvents[i].picks.push(pPick);
            }
            callback();
        }

        async.eachSeries(picks, processPick, callback);

    }

    function getFollowers(callback){
        FollowBl.getFollowerListForEmails(user._id, callback);
    }

    function filterFollowerWithNotificationsOn(followers, callback){
        followers = _.filter(followers, function(follow){
            return follow.notify === true || typeof follow.notify === 'undefined';
        });
        callback(null, followers);
    }

    function filterFollowersWithCorrectStatus(followers, callback){
        function checkStatus(follower, callback){
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
                callback();
            }
            if(!follower.follower.ref) return callback();
            UserBl.getUserStatus(follower.follower.ref, cb);
        }

        async.eachSeries(followers, checkStatus, callback);
    }

    function sendBaseEmails(callback){

        function sendEmails(follower, callback){
            sendPicksEmail_base(follower, user.username, processedEvents, hostName, callback);
        }

        async.eachSeries(baseFollowerList, sendEmails, callback);
    }

    function sendPremiumEmails(callback){

        function sendEmails(follower, callback){
            sendPicksEmail_premium(follower, user.username, processedEvents, hostName, callback);
        }

        async.eachSeries(premiumFollowerList, sendEmails, callback);
    }


    todo.push(populatePicks);
    todo.push(processPicks);
    todo.push(getFollowers);
    todo.push(filterFollowerWithNotificationsOn);
    todo.push(filterFollowersWithCorrectStatus);
    todo.push(sendBaseEmails);
    todo.push(sendPremiumEmails);

    async.waterfall(todo, callback);

}

function sendPicksEmail_base(user, pickUserName, events, hostName, callback){
    var todo = [];

    for(var i=0; i<events.length; i++){
        events[i].generalPicks = _.filter(events[i].picks, {premium:false});
        events[i].proPicks = _.filter(events[i].picks, {premium:true});
        events[i].proCount = events[i].proPicks.length;
        events[i].generalPickCount = events[i].generalPicks.length;
    }

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/new-picks-base.server.view.html';
        var json = {
            user: user.username,
            pickUser: pickUserName,
            events: events,
            userUrl: 'https://' + hostName + '/profile/'+pickUserName,
            manageUrl: 'https://' + hostName + '/settings'
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

function sendPicksEmail_premium(user, pickUserName, events, hostName, callback){
    var todo = [];

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/new-picks-premium.server.view.html';
        var json = {
            user: user.username,
            pickUser: pickUserName,
            events: events,
            userUrl: 'https://' + hostName + '/profile/'+pickUserName,
            manageUrl: 'https://' + hostName + '/settings'
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
            picksUrl: 'https://' + hostName + '/make-picks',
            userUrl: 'https://' + hostName + '/profile/'+followUserName,
            manageUrl: 'https://' + hostName + '/settings'
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
        if (err){
            var e = new Error('Error sending email - sendFollowerEmail');
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
        if (err){
            var e = new Error('Error sending email - sendMessageEmail');
            e.error = err;
            callback(e);
            return;
        }
        callback();
    }

    todo.push(render);
    todo.push(send);
}

function sendTrialOverEmail(user, hostName, callback){
    if(!user.email) return callback(null);
    var todo = [];

    function render(callback){
        function cb(err, emailHTML){
            callback(err, emailHTML);
        }

        var templatePath = 'modules/fu/server/views/templates/trial-over-email.server.view.html';
        var json = {
            user: user.username,
            url: 'https://' + hostName + '/why-go-pro'
        };
        renderTemplate(templatePath, json, cb);
    }

    function send(emailHTML, callback){
        function cb(err){
            callback(err);
        }
        var subject = 'Your 7 Day Trial of FansUnite Pro has Ended';
        sendEmail(emailHTML, subject, user.email, cb);
    }

    function cb(err){
        if (err){
            var e = new Error('Error sending email - sendTrialOverEmail');
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

function sendHotPickEmail(hotPick, hostName, callback){
    var todo = [];
    var hotPickInfo = {};

    function populateHotPick(callback){
        var populate = [
            {path: 'event', model:'Event', select: '-pinnacleBets'},
            {path: 'bet', model:'Bet'}
        ];
        HotPickBl.populateBy(hotPick, populate, callback);
    }

    function processHotPick(hotPick, callback){
        hotPickInfo.header = hotPick.sport.name+' | '+hotPick.league.name+' | '+hotPick.event.contestant2.name+' @ '+hotPick.event.contestant1.name + ' | '+new Date(hotPick.event.startTime).toUTCString();
        hotPickInfo.betName = betName(hotPick.bet.toJSON());
        callback();
    }

    function getUsers(callback){
        UserBl.getHotPickUsers(callback);
    }

    function sendEmails(users, callback){

        function sendEmail_todo(user, callback){
            if(!user.email) return callback();
            var todo = [];

            function render(callback){
                function cb(err, emailHTML){
                    callback(err, emailHTML);
                }

                var templatePath = 'modules/fu/server/views/templates/new-hotpick.server.view.html';
                var json = {
                    user: user.username,
                    hotPickInfo: hotPickInfo,
                    url: 'https://' + hostName + '/make-picks',
                    manageUrl: 'https://' + hostName + '/settings'
                };
                renderTemplate(templatePath, json, cb);
            }

            function send(emailHTML, callback){
                function cb(err){
                    callback(err);
                }
                var subject = 'New Hot Pick';
                sendEmail(emailHTML, subject, user.email, cb);
            }

            function cb(err){
                if (err){
                    var e = new Error('Error sending email - sendHotPickEmail');
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


        async.eachSeries(users, sendEmail_todo, callback);

    }

    todo.push(populateHotPick);
    todo.push(processHotPick);
    todo.push(getUsers);
    todo.push(sendEmails);

    async.waterfall(todo, callback);
}

exports.sendVerificationEmail   = sendVerificationEmail;
exports.sendFollowerEmail       = sendFollowerEmail;
exports.sendMessageEmail        = sendMessageEmail;
exports.sendPicksEmails         = sendPicksEmails;
exports.sendTrialOverEmail      = sendTrialOverEmail;
exports.sendHotPickEmail        = sendHotPickEmail;