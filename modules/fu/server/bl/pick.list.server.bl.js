'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    EventBl = require('./event.server.bl'),
    PickBl = require('./pick.server.bl');


function getEventPickList(sportId, leagueId, userId, page, pageLimit, pickLimit, pendingCompleted, userPremium, callback){

    var todo = [];

    function getPicksGroupedByEvent(callback){

        var aggArray = [];

        var query = {};
        if(sportId !== 'all')                 query.sport = mongoose.Types.ObjectId(sportId);
        if(leagueId !== 'all')                query.league = mongoose.Types.ObjectId(leagueId);
        if(pendingCompleted === 'pending')    query.result = 'Pending';
        if(pendingCompleted === 'completed')  query.result = {$ne: 'Pending'};
        if(userId)                            query['user.ref'] = mongoose.Types.ObjectId(userId);

        var match = {$match: query};
        var group = {$group: {'_id': '$event', picks: {$addToSet: '$$ROOT'}}};
        var project = {$project: {event: '$_id', picks: 1}};

        var sort;
        if(pendingCompleted === 'pending')    sort = {eventStartTime: -1};
        if(pendingCompleted === 'completed')  sort = {eventStartTime: 1};

        sort = {$sort: sort};

        var skip = {$skip: page*pageLimit};
        var limit = {$limit: pageLimit};

        aggArray.push(match);
        aggArray.push(sort);
        aggArray.push(group);
        aggArray.push(project);
        aggArray.push(skip);
        aggArray.push(limit);

        PickBl.aggregate(aggArray, callback);

    }

    function populateEvents(events, callback){
        var populate = [{path: 'event', model:'Event'}, {path:'picks.user.ref', model: 'User', select: 'username avatarUrl'}];
        PickBl.populateBy(events, populate, callback);
    }

    function populateBets(events, callback){
        var populate = {path: 'event.pinnacleBets', model:'Bet'};
        EventBl.populateBy(events, populate, callback);
    }

    function processEvents(events, callback){
        var processedEvents = [];
        var mainBetDurations = ['game', 'match'];

        function processEvent(eventGroup, callback){
            var todo = [];
            var pEvent = {};
            var event = eventGroup.event;

            function createEvent(callback){
                pEvent = {
                    sport:          event.sport,
                    league:         event.league,
                    startTime:      event.startTime,
                    commentCount:   event.commentCount,
                    cancelled:      event.cancelled
                };

                callback();

            }

            function getPickCounts(callback){
                pEvent.pickCount = eventGroup.picks.length;
                var proPicks = _.filter(eventGroup.picks, {premium: true});
                pEvent.proCount = proPicks.length;
                callback();
            }

            function assignContestantInfo(callback){
                if(event.sport.name !== 'Soccer'){
                    pEvent.contestant1 = event.contestant2;
                    pEvent.contestant2 = event.contestant1;
                    if(event.over){
                        pEvent.contestant1FinalScore = event.contestant2FinalScore;
                        pEvent.contestant2FinalScore = event.contestant1FinalScore;
                    }
                } else {
                    pEvent.contestant1 = event.contestant1;
                    pEvent.contestant2 = event.contestant2;
                    if(event.over){
                        pEvent.contestant1FinalScore = event.contestant1FinalScore;
                        pEvent.contestant2FinalScore = event.contestant2FinalScore;
                    }
                }

                if(event.contestantWinner.ref === pEvent.contestant1.ref){
                    pEvent.winner = 1;
                } else if (event.contestantWinner.ref === pEvent.contestant2.ref){
                    pEvent.winner = 2;
                }
                callback();

            }

            function orderPicks(callback){
                pEvent.picks = _.sortBy(eventGroup.picks, function(pick){
                    return pick.timeSubmitted;
                });
                pEvent.picks = _.sortBy(pEvent.picks, function(pick){
                    return pick.premium;
                });
                callback();

            }

            function filterPicks(callback){
                pEvent.picks = pEvent.picks.splice(0, pickLimit);
                callback();
            }

            function hideProPicks(callback){
                if(!userPremium){
                    for(var i=0; i<pEvent.picks; i++){
                        if(pEvent.picks[i].premium){
                            pEvent.picks[i] = {hidden: true};
                        }
                    }
                }
                callback();
            }


            function getContestantOdds(callback){

                var todo = [];

                function getContestant1Spread(callback){
                    var contestant1Spread = _.find(eventGroup.event.pinnacleBets, function(bet){
                        if(bet.contestant){
                            return mainBetDurations.indexOf(bet.betDuration) !== -1 && bet.betType === 'spread' && String(pEvent.contestant1.ref) === String(bet.contestant.ref) && !bet.altLine;
                        }
                    });
                    if(contestant1Spread){
                        pEvent.contestant1Value = contestant1Spread.spread;
                        pEvent.contestant1ValueType = 'spread';
                    }
                    callback();

                }

                function getTotals(callback){
                    if(pEvent.contestant1Value){
                        var totals = _.find(eventGroup.event.pinnacleBets, function(bet){
                            return mainBetDurations.indexOf(bet.betDuration) !== -1 && bet.betType === 'total points' && !bet.altLine;
                        });
                        if(totals){
                            pEvent.contestant2Value = totals.points;
                            pEvent.contestant2ValueType = 'total points';
                        }
                    }

                    callback();

                }

                function getMoneyLine(callback){
                    if(!pEvent.contestant1Value){
                        var moneyline1 = _.find(eventGroup.event.pinnacleBets, function(bet){
                            if(bet.contestant){
                                return mainBetDurations.indexOf(bet.betDuration) !== -1 && bet.betType === 'moneyline' && String(pEvent.contestant1.ref) === String(bet.contestant.ref);
                            }
                        });
                        if (moneyline1){
                            pEvent.contestant1Value = moneyline1.odds;
                            pEvent.contestant1ValueType = 'odds';
                        }

                        var moneyline2 = _.find(eventGroup.event.pinnacleBets, function(bet){
                            if(bet.contestant){
                                return mainBetDurations.indexOf(bet.betDuration) !== -1 && bet.betType === 'moneyline' && String(pEvent.contestant2.ref) === String(bet.contestant.ref);
                            }
                        });
                        if (moneyline2){
                            pEvent.contestant1Value = moneyline1.odds;
                            pEvent.contestant1ValueType = 'odds';
                        }
                    }

                    callback();
                }

                todo.push(getContestant1Spread);
                todo.push(getTotals);
                todo.push(getMoneyLine);

                async.waterfall(todo, callback);

            }

            function pushEvent(callback){
                processedEvents.push(pEvent);
                callback();
            }

            todo.push(createEvent);
            todo.push(getPickCounts);
            todo.push(assignContestantInfo);
            todo.push(orderPicks);
            todo.push(filterPicks);
            todo.push(hideProPicks);
            todo.push(getContestantOdds);
            todo.push(pushEvent);

            async.waterfall(todo, callback);

        }

        function cb(err){
            callback(err, processedEvents);
        }

        async.each(events, processEvent, cb);
    }


    todo.push(getPicksGroupedByEvent);
    todo.push(populateEvents);
    todo.push(populateBets);
    todo.push(processEvents);

    async.waterfall(todo, callback);

}

exports.getEventPickList = getEventPickList;