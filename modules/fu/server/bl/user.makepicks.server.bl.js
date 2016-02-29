'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    Bet = mongoose.model('Bet'),
    Pick = mongoose.model('Pick'),
    BetBl = require('./bet.server.bl'),
    PickBl = require('./pick.server.bl'),
    UserMakePicksCreate = require('./user.makepicks.create.server.bl'),
    EmailBl = require('./email.server.bl'),
    User = mongoose.model('User');



function submit(user, eventGroups, hostName, callback){

    var todo = [];
    var totalAtRisk = 0;
    var picks = [];
    var bets = _.chain(eventGroups).pluck('picks').flatten().value();
    var events = _.pluck(eventGroups, 'event');
    var validUnits = [1,2,3,4,5];

    function checkInvalidUnits(callback){
        var invalidUnits = [];

        function checkBet(bet, callback){
            if(validUnits.indexOf(bet.units) === -1) invalidUnits.push({betId: bet._id});
            callback();
        }

        function cb(err){
            if(invalidUnits.length > 0){
                err = {
                    message: 'Select between 1-5 units for the highlighted bet(s).',
                    type: 'invalid units',
                    values: invalidUnits
                };
            }
            callback(err);
        }

        async.each(bets, checkBet, cb);
    }

    function checkEnoughUnits(callback){
        totalAtRisk = _.chain(eventGroups).pluck('picks').flatten().pluck('units').sum().value();
        if(totalAtRisk > user.units){
            var err = {
                message: 'Not enough Units remaining, Please remove some picks from you Bet Slip.',
                type: 'units'
            };
            return callback(err);
        }
        callback();
    }

    function checkEventStarted(callback){
        var startedEvents = [];
        var now = new Date();

        function checkEvent(event, callback){
            if(now > new Date(event.startTime)) startedEvents.push({eventId: event._id});
            callback();
        }

        function cb(err){
            if(startedEvents.length > 0){
                err = {
                    message: 'The highlighted event(s) have started. Please remove them from your Bet Slip.',
                    type: 'started',
                    values: startedEvents
                };
            }
            callback(err);
        }

        async.each(events, checkEvent, cb);
    }

    function checkValueChange(callback){

        var changedValues = [];

        function checkBet(bet, callback){
            function cb(err, betDb){
                if(betDb){
                    var changedValue = {};
                    var changed = false;
                    if(bet.spread !== betDb.spread) {
                        changedValue.spread = betDb.spread;
                        changed = true;
                    }
                    if(bet.points !== betDb.points){
                        changedValue.points = betDb.points;
                        changed = true;
                    }
                    if(bet.odds !== betDb.odds){
                        changedValue.odds = betDb.odds;
                        changed = true;
                    }

                    if(changed){
                        changedValue.betId = betDb._id;
                        changedValue.eventId = betDb.event;
                        changedValues.push(changedValue);
                    }
                }

                callback();
            }
            BetBl.get(bet._id, cb);
        }

        function cb(err){
            if(changedValues.length > 0){
                err = {
                    message: 'The highlighted values(s) have changed. Please submit again to accept these changes.',
                    type: 'changed',
                    values: changedValues
                };
            }
            callback(err);

        }

        async.each(bets, checkBet, cb);
    }

    function checkPickMade(callback){
        var duplicates = [];

        function checkBet(bet, callback){
            function cb(err, pick){
                if(pick){
                    duplicates.push({betId: pick.bet, eventId: pick.event});
                }
                callback();
            }
            PickBl.getOneByQuery({bet: bet._id, 'user.ref': user._id}, cb);
        }

        function cb(err){
            if(duplicates.length > 0){
                err = {
                    message: 'The highlighted pick(s) have already been made. Please remove them from your Bet Slip.',
                    type: 'duplicate',
                    values: duplicates
                };
            }
            callback(err);
        }

        async.each(bets, checkBet, cb);
    }

    function submitPicks(callback){

        function submitEventBets(eventGroup, callback){
            var event = eventGroup.event;

            function submitBet(bet, callback){

                function cb(err, pick){
                    if(!err) picks.push(pick);
                    callback(err);
                }

                UserMakePicksCreate.create(event, bet, user, cb);

            }

            async.each(eventGroup.picks, submitBet, callback);
        }

        async.each(eventGroups, submitEventBets, callback);
    }

    function updateUser(callback){

        user.units = user.units - totalAtRisk;
        user.pickMade = true;
        function cb(err){
            callback(err);
        }
        user.save(cb);
    }

    function sendEmailNotifications(callback){
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'cloud-foundry' ) return callback(); //don't send emails if not in production
        EmailBl.sendPicksEmails(picks, user, hostName, function cb(err){});
        return callback();
    }

    function cb(err){
        callback(err, {user: user, picks: picks});
    }

    todo.push(checkInvalidUnits);
    todo.push(checkEnoughUnits);
    todo.push(checkEventStarted);
    todo.push(checkValueChange);
    todo.push(checkPickMade);
    todo.push(submitPicks);
    todo.push(updateUser);
    todo.push(sendEmailNotifications);

    async.waterfall(todo, cb);

}


exports.submit       = submit;