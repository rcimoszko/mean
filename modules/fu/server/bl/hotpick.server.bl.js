'use strict';

var _ = require('lodash'),
    async = require('async'),
    PickBl = require('./pick.server.bl'),
    EventBl = require('./event.server.bl'),
    BetBl = require('./bet.server.bl'),
    UserBl = require('./user.server.bl'),
    EmailBl =  require('./email.server.bl'),
    BetDurationBl = require('./bet.betduration.server.bl'),
    mongoose = require('mongoose'),
    HotPick = mongoose.model('HotPick');

function updateHotPick(callback){

    var todo = [];

    function groupProPicks(callback){
        var query =  {result: 'Pending', premium: true, eventStartTime: {$gte: new Date()}};
        query.betDuration = {$in:BetDurationBl.mainBetDurations};

        var match = {$match: query};
        var group = {$group: {'_id': '$event', picks: {$addToSet: '$$ROOT'}}};
        var sort =  {$sort: {'eventStartTime': -1}};

        var aggArray = [];
        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(sort);

        PickBl.aggregate(aggArray, callback);
    }

    function populateEvents(events, callback){
        var populate = [{path: '_id', model:'Event'}];
        PickBl.populateBy(events, populate, callback);
    }

    function populateEventsLeagues(events, callback){
        var populate = [{path: '_id.league.ref', model:'League'}];
        EventBl.populateBy(events, populate, callback);
    }

    function calculateCounts(events, callback){
        var overUnder = ['over', 'under'];
        var bestMargin = 0;
        var hotPick = {};

        function calculateCount(event, callback){
            var groupedBets = _.groupBy(event.picks, function(pick){
                return pick.betType;
            });
            var margin;

            console.log(groupedBets);

            for(var betType in groupedBets){
                switch (betType){
                    case 'moneyline':
                    case 'spread':
                        var contestantGroup = _.groupBy(groupedBets[betType], 'contestant.ref');
                        for(var num = 1; num <= 2;num++ ){
                            var contestantId = event._id['contestant'+num].ref;
                            if(contestantGroup[contestantId]){
                                event[betType+num+'Count'] = contestantGroup[contestantId].length;
                            } else {
                                event[betType+num+'Count'] = 0;
                            }
                        }
                        margin = event[betType+'1Count'] - event[betType+'2Count'];
                        if(Math.abs(margin) > bestMargin){
                            bestMargin = Math.abs(margin);
                            if(margin > 0){
                                hotPick = {betType: betType, contestantId: event._id.contestant1.ref, event: event._id, proPicks: contestantGroup[event._id.contestant1.ref], proCount: contestantGroup[event._id.contestant1.ref].length};
                            } else {
                                hotPick = {betType: betType, contestantId: event._id.contestant2.ref, event: event._id, proPicks: contestantGroup[event._id.contestant2.ref], proCount: contestantGroup[event._id.contestant2.ref].length};
                            }
                        }
                        break;
                    case 'total points':
                        var overUnderGroup = _.groupBy(groupedBets[betType], 'overUnder');
                        for(var i=0; i<overUnder.length; i++){
                            if(overUnderGroup[overUnder[i]]){
                                event[overUnder[i]+'Count'] = overUnderGroup[overUnder[i]].length;
                            } else {
                                event[overUnder[i]+'Count'] = 0;
                            }
                            margin = event.overCount - event.underCount;
                        }
                        if(Math.abs(margin) > bestMargin){
                            bestMargin = Math.abs(margin);
                            if(margin > 0){
                                hotPick = {betType: betType, overUnder: 'over' , event: event._id};
                            } else {
                                hotPick = {betType: betType, overUnder: 'under', event: event._id};
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            callback();
        }

        function cb(err){
            callback(err, hotPick);
        }

        async.eachSeries(events, calculateCount, cb);

    }

    function findHotPick(hotPickInfo, callback){
        if(!Object.keys(hotPickInfo).length) return callback(null, null);
        var event =  hotPickInfo.event;
        var hotPick = {
            event: event,
            sport: event.sport,
            league: event.league,
            proCount: hotPickInfo.proCount,
            proPicks: hotPickInfo.proPicks
        };

        var todo = [];

        function findBet(callback){
            var betType = hotPickInfo.betType;
            var query = {betType: betType, $or:[{altLine: {$exists:false}},{altLine: false}], event: event._id, betDuration: {$in:BetDurationBl.mainBetDurations}};

            switch (hotPickInfo.betType){
                case 'moneyline':
                case 'spread':
                    query['contestant.ref'] = hotPickInfo.contestantId;
                    break;
                case 'total points':
                    query.overUnder = hotPickInfo.overUnder;
                    break;
                default:
                    break;
            }

            var populate = {path:'contestant.ref', Model:'Contestant'};

            BetBl.getOneAndPopulate(query, populate, callback);
        }

        function checkIfBetIsNew(bet, callback){
            function cb(err, hotPick){
                if(!hotPick) return callback(err, bet);
                callback('Hot Pick Unchanged');
            }

            HotPick.findOne({bet:bet}, cb);
        }

        function getPick(bet, callback){
            hotPick.bet = bet;
            callback(null, hotPick);
        }

        todo.push(findBet);
        todo.push(checkIfBetIsNew);
        todo.push(getPick);

        async.waterfall(todo, callback);

    }

    function createHotPick(hotPick, callback){
        HotPick.create(hotPick, callback);
    }

    function sendEmails(hotPick, callback){

        EmailBl.sendHotPickEmail(hotPick, 'fansunite.com', callback);

        var todo = [];

        function getUsers(callback){
            UserBl.getByQuery({roles:['admin']}, callback);
        }

        function sendEmailsToUser(users, callback){

        }

        todo.push(getUsers);
        todo.push(sendEmailsToUser);

        async.waterfall(todo, callback);
    }

    todo.push(groupProPicks);
    todo.push(populateEvents);
    todo.push(populateEventsLeagues);
    todo.push(calculateCounts);
    todo.push(findHotPick);
    todo.push(createHotPick);
    todo.push(sendEmails);

    async.waterfall(todo, callback);

}

function getHotPick(sportId, leagueId, callback){
    var todo = [];

    function groupProPicks(callback){
        var query =  {result: 'Pending', premium: true, eventStartTime: {$gte: new Date()}};
        if(sportId !== 'all') query.sport = mongoose.Types.ObjectId(sportId);
        if(leagueId !== 'all') query.league = mongoose.Types.ObjectId(leagueId);
        query.betDuration = {$in:BetDurationBl.mainBetDurations};

        var match = {$match: query};
        var group = {$group: {'_id': '$event', picks: {$addToSet: '$$ROOT'}}};
        var sort =  {$sort: {'eventStartTime': -1}};

        var aggArray = [];
        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(sort);

        PickBl.aggregate(aggArray, callback);
    }

    function populateEvents(events, callback){
        var populate = [{path: '_id', model:'Event'}];
        PickBl.populateBy(events, populate, callback);
    }

    function populateEventsLeagues(events, callback){
        var populate = [{path: '_id.league.ref', model:'League'}];
        EventBl.populateBy(events, populate, callback);
    }

    function calculateCounts(events, callback){
        var overUnder = ['over', 'under'];
        var bestMargin = 0;
        var hotPick = { };

        function calculateCount(event, callback){
            var groupedBets = _.groupBy(event.picks, function(pick){
                return pick.betType;
            });
            var margin;

            for(var betType in groupedBets){
                switch (betType){
                    case 'moneyline':
                    case 'spread':
                        var contestantGroup = _.groupBy(groupedBets[betType], 'contestant.ref');
                        for(var num = 1; num <= 2;num++ ){
                            var contestantId = event._id['contestant'+num].ref;
                            if(contestantGroup[contestantId]){
                                event[betType+num+'Count'] = contestantGroup[contestantId].length;
                            } else {
                                event[betType+num+'Count'] = 0;
                            }
                        }
                        margin = event[betType+'1Count'] - event[betType+'2Count'];
                        if(Math.abs(margin) > bestMargin){
                            bestMargin = Math.abs(margin);
                            if(margin > 0){
                                hotPick = {betType: betType, contestantId: event._id.contestant1.ref, event: event._id};
                            } else {
                                hotPick = {betType: betType, contestantId: event._id.contestant2.ref , event: event._id};
                            }
                        }
                        break;
                    case 'total points':
                        var overUnderGroup = _.groupBy(groupedBets[betType], 'overUnder');
                        for(var i=0; i<overUnder.length; i++){
                            if(overUnderGroup[overUnder[i]]){
                                event[overUnder[i]+'Count'] = overUnderGroup[overUnder[i]].length;
                            } else {
                                event[overUnder[i]+'Count'] = 0;
                            }
                            margin = event.overCount - event.underCount;
                        }
                        if(Math.abs(margin) > bestMargin){
                            bestMargin = Math.abs(margin);
                            if(margin > 0){
                                hotPick = {betType: betType, overUnder: 'over' , event: event._id};
                            } else {
                                hotPick = {betType: betType, overUnder: 'under', event: event._id};
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            callback();
        }

        function cb(err){
            callback(err, hotPick);
        }

        async.eachSeries(events, calculateCount, cb);

    }

    function findHotPick(hotPickInfo, callback){
        if(!Object.keys(hotPickInfo).length) return callback(null, null);
        var event =  hotPickInfo.event;
        var hotPick = {
            event: event,
            bet: null,
            pick: {
                betName: null,
                league:  event.league.name,
                value: null
            }
        };

        var todo = [];

        function findBet(callback){
            var betType = hotPickInfo.betType;
            var query = {betType: betType, $or:[{altLine: {$exists:false}},{altLine: false}], event: event._id, betDuration: {$in:BetDurationBl.mainBetDurations}};

            switch (hotPickInfo.betType){
                case 'moneyline':
                case 'spread':
                    query['contestant.ref'] = hotPickInfo.contestantId;
                    break;
                case 'total points':
                    query.overUnder = hotPickInfo.overUnder;
                    query.contestant = {$exists: false};
                    break;
                default:
                    break;
            }

            var populate = {path:'contestant.ref', Model:'Contestant'};

            BetBl.getOneAndPopulate(query, populate, callback);
        }

        function getPick(bet, callback){
            hotPick.bet = bet;

            switch (bet.betType){
                case 'moneyline':
                    hotPick.pick.betName = bet.contestant.name;
                    hotPick.pick.value = bet.odds;
                    hotPick.pick.betType  = bet.betType;
                    hotPick.pick.logoUrl  = bet.contestant.ref.logoUrl;
                    break;
                case 'spread':
                    hotPick.pick.betName = bet.contestant.name;
                    hotPick.pick.value = bet.spread;
                    hotPick.pick.betType  = bet.betType;
                    hotPick.pick.logoUrl  = bet.contestant.ref.logoUrl;
                    break;
                case 'total points':
                    hotPick.pick.betName = event.contestant1.name +'/'+event.contestant2.name + ' Total Points';
                    hotPick.pick.value = bet.overUnder.charAt(0)+bet.points;
                    hotPick.pick.betType  = bet.betType;
                    break;
                default:
                    break;
            }
            callback(null, hotPick);
        }

        todo.push(findBet);
        todo.push(getPick);

        async.waterfall(todo, callback);

    }

    todo.push(groupProPicks);
    todo.push(populateEvents);
    todo.push(populateEventsLeagues);
    todo.push(calculateCounts);
    todo.push(findHotPick);

    async.waterfall(todo, callback);

}


exports.getHotPick    = getHotPick;
exports.updateHotPick = updateHotPick;

