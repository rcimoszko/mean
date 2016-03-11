'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    EventBl = require('./event.server.bl'),
    PickBl = require('./pick.server.bl');

function getUserEventPickList(sportId, leagueId, userIdArray, authUser, authUserPremium, callback){
    var todo = [];


    function getPicksGroupedByUser(callback){
        var aggArray = [];

        var query =                           {'user.ref': {$in:userIdArray}, result:'Pending'};
        if(sportId !== 'all')                 query.sport = mongoose.Types.ObjectId(sportId);
        if(leagueId !== 'all')                query.league = mongoose.Types.ObjectId(leagueId);


        var match = {$match: query};
        var group = {$group: {'_id': '$user', picks: {$addToSet: '$$ROOT'}}};
        var project = {$project: {user: '$_id', picks: 1}};

        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(project);

        PickBl.aggregate(aggArray, callback);
    }


    function groupByEvent(userPicks, callback){

        function processUserGroup(userGroup, callback){
            var eventList = [];
            var eventPicks = _.groupBy(userGroup.picks, 'event');
            for(var eventId in eventPicks){
                var event = {event:  mongoose.Types.ObjectId(eventId), picks: eventPicks[eventId]};
                eventList.push(event);
            }

            function cb(err, processedEvents){
                userGroup.events = processedEvents;
                callback(err);
            }

            processEventList(eventList, null, 'pending', null,  authUser, authUserPremium,  cb);
        }

        function cb(err){
            callback(err, userPicks);
        }

        async.eachSeries(userPicks, processUserGroup, cb);
    }



    todo.push(getPicksGroupedByUser);
    todo.push(groupByEvent);

    function cb(err, userPicks){
        callback(err, userPicks);
    }

    async.waterfall(todo, cb);


}

function getEventPickList(sportId, leagueId, userId, pro, page, pageLimit, pickLimit, pendingCompleted, authUserId, authUserPremium, callback){

    var todo = [];

    function getPicksGroupedByEvent(callback){

        var aggArray = [];

        var query = {};
        if(sportId !== 'all')                 query.sport = mongoose.Types.ObjectId(sportId);
        if(leagueId !== 'all')                query.league = mongoose.Types.ObjectId(leagueId);
        if(pendingCompleted === 'pending'){
            query.result = 'Pending';
            query.eventStartTime = {$gte:new Date()};
        }
        if(pendingCompleted === 'completed')  query.result = {$ne: 'Pending'};
        if(userId)                            query['user.ref'] = mongoose.Types.ObjectId(userId);
        if(pro)                               query.premium = true;

        var match = {$match: query};
        var group = {$group: {'_id': '$event', picks: {$addToSet: '$$ROOT'}}};
        var project = {$project: {event: '$_id', picks: 1}};

        var sort;
        if(pendingCompleted === 'pending')    sort = {eventStartTime: 1};
        if(pendingCompleted === 'completed')  sort = {eventStartTime: -1};

        sort = {$sort: sort};

        var skip = {$skip: page*pageLimit};
        var limit = {$limit: pageLimit};

        aggArray.push(match);
        aggArray.push(sort);
        aggArray.push(skip);
        aggArray.push(limit);
        aggArray.push(group);
        aggArray.push(project);

        PickBl.aggregate(aggArray, callback);

    }

    function processEvents(events, callback){
        processEventList(events, userId, pendingCompleted, pickLimit,  authUserId, authUserPremium, callback);
    }

    todo.push(getPicksGroupedByEvent);
    todo.push(processEvents);

    async.waterfall(todo, callback);

}

function processEventList(events, userId, pendingCompleted, pickLimit,  authUserId, authUserPremium, callback){

    var todo = [];

    function populatePicks(callback){
        var populate = [{path: 'event', model:'Event'},
                        {path:'picks.user.ref', model: 'User', select: 'username avatarUrl'},
                        {path:'picks.bet', model:'Bet'}];  //had to populate bets for copying bets
        PickBl.populateBy(events, populate, callback);
    }

    function populateEvents(events, callback){
        var populate = [{path: 'event.pinnacleBets', model:'Bet'},
                        {path: 'event.sport.ref', model:'Sport'}, //had to populate sport/league for copying bets
                        {path: 'event.league.ref', model:'League'}
                        ];
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
                    _id:            event._id,
                    sport:          event.sport,
                    league:         event.league,
                    startTime:      event.startTime,
                    commentCount:   event.commentCount,
                    cancelled:      event.cancelled,
                    slug:           event.slug,
                    leagueSlug:     event.league.ref.slug,
                    over:           event.over
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
                if(pickLimit) pEvent.picks = pEvent.picks.splice(0, pickLimit);
                callback();
            }

            function hideProPicks(callback){
                for(var i=0; i<pEvent.picks.length; i++){
                    if(String(pEvent.picks[i].user.ref._id) !== String(authUserId)){
                        if(pEvent.picks[i].premium && !authUserPremium){
                            pEvent.picks[i] = {hidden: true, user:pEvent.picks[i].user};

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

                    }

                    if(!pEvent.contestant2Value){
                        var moneyline2 = _.find(eventGroup.event.pinnacleBets, function(bet){
                            if(bet.contestant){
                                return mainBetDurations.indexOf(bet.betDuration) !== -1 && bet.betType === 'moneyline' && String(pEvent.contestant2.ref) === String(bet.contestant.ref);
                            }
                        });
                        if (moneyline2){
                            pEvent.contestant2Value = moneyline2.odds;
                            pEvent.contestant2ValueType = 'odds';
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
            if(pendingCompleted === 'pending') {
                processedEvents = _.sortBy(processedEvents, function(event){
                    return event.startTime;
                });
            } else if (pendingCompleted === 'completed'){
                processedEvents = _.sortBy(processedEvents, function(event){
                    return -1*event.startTime;
                });
            }

            callback(err, processedEvents);
        }

        async.each(events, processEvent, cb);
    }


    todo.push(populatePicks);
    todo.push(populateEvents);
    todo.push(processEvents);


    async.waterfall(todo, callback);
}

exports.getEventPickList     = getEventPickList;
exports.getUserEventPickList = getUserEventPickList;