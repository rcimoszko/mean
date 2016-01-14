'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    User = mongoose.model('User');


function checkEventStarted(picks, callback){

}

function checkChangedOdds(picks, callback){

}

function checkDuplicatePicks(picks, callback){

}

function submit(user, eventGroup, callback){

    var picks = _.pluck(eventGroup, 'picks');
    var events = _.pluck(eventGroup, 'events');
    var todo = [];


    function checkEnoughUnits(picks, callback){
        var totalAtRisk = 0;

        /*

        async.eachSeries(picks, function(newPick, callback){
            async.eachSeries(newPick.picks, function(pick, callback){
                totalAtRisk = totalAtRisk + pick.units;
                callback();
            }, function(err){
                callback(err);
            });
        }, function(err){
            if(totalAtRisk > req.user.units){
                return res.send(400, {
                    message: 'Not enough Units remaining, Please remove some picks from you Bet Slip.',
                    type: 'units',
                    value: false
                });
            } else {
                callback(err);
            }
        });
        */
    }


    todo.push(checkEnoughUnits);

    async.waterfall(todo, callback);


    /*
    async.waterfall([
        //Check if enough units


        //check that a maximum of 15 units

        //check if any events have started
        function(callback){
            var startedEvents = [];
            var i = 0;
            var date = new Date();
            async.eachSeries(newPicks, function(newPick, callback){
                var startTime = new Date(newPick.event.startTime);
                if(startTime < date.setMinutes(date.getMinutes())){
                    startedEvents.push(i);
                }
                i++;
                callback();
            }, function(err){
                if(startedEvents.length > 0){
                    return res.send(400, {
                        message: 'The highlighted event(s) have started. Please remove them from your Bet Slip.',
                        type: 'started',
                        values: startedEvents
                    });
                } else {
                    callback(err);
                }
            });
        },

        //check if any odds/spreads/points have changed
        function(callback){
            var changedValues = [];
            async.eachSeries(newPicks, function(newPick, callback){
                Event.findById(newPick.event._id, function(err, eventDb){
                    async.eachSeries(newPick.picks, function(pick, callback){
                        var betDb = _.find(eventDb.betsAvailable, function(bet){
                            return bet.id === pick._id;
                        });
                        var changed = false;
                        var changedValue = {};

                        switch(pick.betType){
                            case 'spread':
                            case 'sets':
                                if(pick.spread !== betDb.spread){
                                    changedValue.spread = betDb.spread;
                                    changed = true;
                                }
                                break;
                            case 'total points':
                            case 'team totals':
                                if(pick.points !== betDb.points){
                                    changedValue.points = betDb.points;
                                    changed = true;
                                }
                                break;
                        }

                        if(pick.odds !== betDb.odds){
                            changedValue.odds = betDb.odds;
                            changed = true;
                        }

                        if(changed){
                            changedValue.pickId = betDb._id;
                            changedValue.eventId = eventDb._id;
                            changedValues.push(changedValue);
                        }
                        callback();

                    }, function(err){
                        callback();
                    });
                });
            }, function(err){
                if(changedValues.length > 0 ){
                    return res.send(400, {
                        message: 'The highlighted values(s) have changed. Please submit again to accept these changes.',
                        type: 'changed',
                        values: changedValues
                    });
                } else {
                    callback(err);
                }
            });
        },

        //check if any bets are duplicates
        function(callback){
            var duplicates = [];
            async.eachSeries(newPicks, function(newPick, callback){
                async.eachSeries(newPick.picks, function(pick, callback){
                    Pick.findOne({bet:pick._id, 'user.ref':req.user._id}, function(err, pickDb){
                        if(pickDb){
                            duplicates.push({eventId: newPick.event._id, pickId: pick._id});
                            callback();
                        } else {
                            callback();
                        }
                    });
                }, function(err){
                    callback(err);
                });
            }, function(err){
                if(duplicates.length > 0){
                    return res.send(400, {
                        message: 'The highlighted pick(s) have already been made. Please remove them from your Bet Slip.',
                        type: 'duplicate',
                        values: duplicates
                    });
                }
                callback(err);
            });
        }],function(err){

        var newPicksDb = [];
        async.eachSeries(newPicks, function(newPick,callback){
            var event = newPick.event;
            var bets = newPick.picks;
            async.eachSeries(bets, function(bet, callback){
                var newPickDb = new Pick({
                    event: event._id,
                    sport: event.sport.ref,
                    league: event.league.ref,
                    bet: bet._id,
                    user: {name: req.user.username, ref: req.user._id},
                    altLine: bet.altLine,
                    otIncluded: bet.otIncluded,

                    betType: bet.betType,
                    betDuration: bet.betDuration,

                    odds: bet.odds,
                    units: bet.units,
                    eventStartTime: event.startTime
                });

                switch(bet.betType){
                    case 'spread':
                        newPickDb.spread = bet.spread;
                        newPickDb.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                        break;
                    case 'total points':
                        newPickDb.points = bet.points;
                        newPickDb.overUnder = bet.overUnder;
                        break;
                    case 'team totals':
                        newPickDb.points = bet.points;
                        newPickDb.overUnder = bet.overUnder;
                        newPickDb.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                        break;
                    case 'moneyline':
                        if(bet.draw){
                            newPickDb.draw = true;
                        } else {
                            newPickDb.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                            newPickDb.underdog = bet.underdog;
                        }
                        break;
                    case 'sets':
                        newPickDb.spread = bet.spread;
                        newPickDb.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                        break;
                }

                if('contestant' in newPickDb){
                    if(!event.neutral){
                        if(String(newPickDb.contestant.ref) === String(event.contestant1.ref)) {
                            newPickDb.contestant.homeAway = 'home';
                        } else if (String(newPickDb.contestant.ref) === String(event.contestant2.ref)){
                            newPickDb.contestant.homeAway = 'away';
                        }
                    }
                }

                // create slug
                var currentTime = new Date().toString().split(' ');
                var dateString = currentTime[1]+' '+currentTime[2]+' '+currentTime[3]+'--'+currentTime[4].substring(0, currentTime[4].length - 3);
                var betString = newPickDb.betDuration + ' '+ newPickDb.betType;


                //copied
                if('copiedFrom' in bet){
                    newPickDb.copiedFrom = bet.copiedFrom;
                    newPickDb.copiedOrigin = bet.copiedOrigin;
                }

                switch(newPickDb.betType){
                    case 'moneyline':
                        if(newPickDb.draw){
                            betString = betString+' draw';
                        } else {
                            betString = betString + ' ' + newPickDb.contestant.name;
                        }
                        break;
                    case 'spread':
                        if(newPickDb.draw){
                            betString = betString+' draw '+newPickDb.spread;
                        } else {
                            betString = betString+' '+newPickDb.contestant.name+' '+newPickDb.spread;
                        }
                        break;
                    case 'total points':
                        betString = betString+' '+event.contestant1.name+'-vs-'+event.contestant2.name+' '+newPickDb.overUnder+' '+newPickDb.points;
                        break;
                    case 'team totals':
                        betString = betString+' '+newPickDb.contestant.name+' '+newPickDb.overUnder+' '+newPickDb.points;
                        break;
                    case 'sets':
                        betString = betString+' '+newPickDb.overUnder+' '+newPickDb.spread;
                        break;
                }
                newPickDb.slug = slug(betString+' '+dateString);


                isPremium(event, req.user, function(premium, premiumTypes, premiumStats){
                    newPickDb.premium = premium;
                    if(premium){
                        newPickDb.premiumTypes = premiumTypes;
                        newPickDb.premiumStats = premiumStats;
                    }
                    newPickDb.save(function(err){
                        if(err){
                            console.log(err);
                            callback();
                        } else{
                            newPicksDb.push(newPickDb);
                            req.user.dailyBet++;
                            achievement.recordAction(req.user, 'make_bet', newPickDb);
                            if('copiedFrom' in bet){
                                //add copied user to pick
                                addCopy(req.user, bet.copiedFrom.pick);
                                addCopy(req.user, bet.copiedOrigin.pick);

                                //Notification for bet copied
                                notification.newNotification('pick copied', newPickDb);


                                //Record action for copying bets
                                achievement.recordAction(req.user, 'copy_pick', newPickDb);

                            }
                            callback();
                        }
                    });
                });



            }, function(err){
                callback(err);
            });
        }, function(err){
            req.user.units = req.user.units - totalAtRisk;
            req.user.pickMade = true;
            req.user.save();
            dcp.postPicksToDCP(req.user, newPicksDb);
            return res.jsonp(req.user);
        });
    });
    */
}


exports.submit       = submit;