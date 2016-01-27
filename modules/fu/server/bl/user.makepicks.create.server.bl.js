'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    slug = require('speakingurl'),
    PickBl = require('./pick.server.bl'),
    LeaderboardQueryBl = require('./leaderboard.query.server.bl');


function addCopy(user, bet){
    var query = {_id: bet};
    var update = {$addToSet:{copied: {name: user.username, ref: user._id}}};

    function cb(err){
        if(err) console.log(err);
    }

    PickBl.updateByQuery(query, update, {}, cb);
}

function calculateStats(userId, type, typeId, betType, timeFrame, callback){

    var aggArray = [];

    var match = {
        $match: {
            'user.ref': mongoose.Types.ObjectId(userId),
            'betType': betType,
            'result': {$ne: 'Pending'}
        }
    };
    match.$match[type] = mongoose.Types.ObjectId(typeId);

    var group = {
        $group:{
            _id: '$user.ref',
            units: {$sum: '$units'},
            profit: {$sum: '$profit'},
            betCount: {$sum:1}
        }

    };

    var project ={
            $project:{
                _id:1,
                units:1,
                profit:1,
                betCount:1,
                roi: { $multiply:[{$divide: [ '$profit', '$units' ]}, 100]}
            }
        };


    switch (timeFrame){
        case 'last 30':
            var startTime = new Date();
            startTime.setDate(startTime.getDate()-30);
            match.$match.timeResolved  = {$gte: startTime};
            break;
    }


    aggArray.push(match);
    aggArray.push(group);
    aggArray.push(project);

    function cb(err, stats){
        if(stats.length){
            callback(err, stats[0]);
        } else {
            callback(err, null);
        }
    }

    PickBl.aggregate(aggArray, cb);
}

function getStats(pick, callback){
    var todo = [];
    var pickStats = {sport: {}, league: {}, group: {}, contestant: {}};


    function calculateAllTimeSportStats(callback){

        function cb(err, stats){
            if(stats){
                pickStats.sport.allTime = {};
                pickStats.sport.allTime = {betCount: stats.betCount, roi: stats.roi};
            }
            callback(err);
        }

        calculateStats(pick.user.ref, 'sport', pick.sport, pick.betType, 'all time', cb);
    }

    function calculateAllTimeLeagueStats(callback){
        function cb(err, stats){
            if(stats){
                pickStats.league.allTime = {};
                pickStats.league.allTime = {betCount: stats.betCount, roi: stats.roi};
            }
            callback(err);
        }

        calculateStats(pick.user.ref, 'league', pick.league, pick.betType, 'all time', cb);

    }

    function calculateAllTimeGroupStats(callback){
        callback();
    }

    function calculateAllTimeContestantStats(callback){

        function cb(err, stats){
            if(stats){
                pickStats.contestant.allTime = {};
                pickStats.contestant.allTime = {betCount: stats.betCount, roi: stats.roi};
            }
            callback(err);
        }

        calculateStats(pick.user.ref, 'contestant.ref', pick.contestant.ref, pick.betType, 'all time', cb);
    }

    function calculateLast30SportStats(callback){
        function cb(err, stats){
            if(stats){
                pickStats.sport.last30 = {};
                pickStats.sport.last30 = {betCount: stats.betCount, roi: stats.roi};
            }
            callback(err);
        }

        calculateStats(pick.user.ref, 'sport', pick.sport, pick.betType, 'last 30', cb);
    }

    function calculateLast30LeagueStats(callback){
        function cb(err, stats){
            if(stats){
                pickStats.league.last30 = {};
                pickStats.league.last30 = {betCount: stats.betCount, roi: stats.roi};
            }
            callback(err);
        }

        calculateStats(pick.user.ref, 'league', pick.league, pick.betType, 'last 30', cb);

    }

    function calculateLast30GroupStats(callback){
        callback();
    }

    function calculateLast30ContestantStats(callback){

        function cb(err, stats){
            if(stats) {
                pickStats.contestant.last30 = {};
                pickStats.contestant.last30 = {betCount: stats.betCount, roi: stats.roi};
            }
            callback(err);
        }

        calculateStats(pick.user.ref, 'contestant.ref', pick.contestant.ref, pick.betType, 'last 30', cb);
    }


    todo.push(calculateAllTimeSportStats);
    todo.push(calculateAllTimeLeagueStats);
    todo.push(calculateAllTimeGroupStats);
    if(pick.contestant) todo.push(calculateAllTimeContestantStats);
    todo.push(calculateLast30SportStats);
    todo.push(calculateLast30LeagueStats);
    todo.push(calculateLast30GroupStats);
    if(pick.contestant) todo.push(calculateLast30ContestantStats);

    function cb(err){
        callback(err, pickStats);
    }

    async.waterfall(todo, cb);
}

function getRanking(user, filterType, filterId, dateId, minBets, minProfit, callback){
    var aggregate = [];
    var match1 = LeaderboardQueryBl.getLeaderboardQuery('completed', dateId, filterType, String(filterId), 'all', 'both');
    var group = {
            $group:{
                _id: '$user.ref',
                profit: {$sum: '$profit'},
                avgOdds: { $avg: '$odds' },
                avgBet: { $avg: '$units' },
                roi: {$avg: '$roi'},
                win: {$sum: {$cond: [{$gt:['$profit', 0]}, 1, 0]}},
                loss: {$sum: {$cond: [{$lt:['$profit', 0]}, 1, 0]}},
                betCount: {$sum:1}
            }
        };
    var sort = {
        $sort : {profit: -1}
    };

    var match2 = { $match:{
        betCount: { $gt: minBets },
        profit: { $gt: minProfit }
        }
    };

    aggregate.push(match1);
    aggregate.push(group);
    aggregate.push(sort);
    aggregate.push(match2);

    function cb(err, leaderboard){
        var rank = _.findIndex(leaderboard, { _id: user._id });
        if(rank !== -1){
            var ranking = leaderboard[rank];
            ranking.rank = rank+1;
            callback(ranking);
        } else {
            callback(null);
        }
    }

    PickBl.aggregate(aggregate, cb);

}

function isPremium(event, user, callback){
    var premium = false;
    var premiumTypes = [];
    var premiumStats = {};
    var filterType = 'league';
    var filterId = event.league.ref;

    if(event.sport.name.toLowerCase() === 'tennis' || event.sport.name.toLowerCase() === 'e sports' || event.sport.name.toLowerCase() === 'golf'){
        filterType = 'sport';
        filterId = event.sport.ref;
    }

    var todo = [];

    function getLast30DaysRanking(callback){
        function cb(ranking){
            if(ranking && ranking.rank > 0 && ranking.rank <= 5){
                premium = true;
                premiumTypes.push('Last30Days');
                premiumStats.Last30Days = {profit: ranking.profit, roi: ranking.roi, win: ranking.win, loss: ranking.loss};
            }
            callback();
        }

        getRanking(user, filterType, filterId, 'last30Days', 10, 10, cb);
    }

    function getAllTimeRanking(callback){
        function cb(ranking){
            if(ranking && ranking.rank > 0 && ranking.rank <= 5){
                premium = true;
                premiumTypes.push('AllTime');
                premiumStats.AllTime = {profit: ranking.profit, roi: ranking.roi, win: ranking.win, loss: ranking.loss};
            }
            callback();
        }
        getRanking(user, filterType, filterId, 'allTime', 25, 20, cb);

    }

    function cb(err){
        callback(premium, premiumTypes, premiumStats);
    }


    todo.push(getLast30DaysRanking);
    todo.push(getAllTimeRanking);

    async.waterfall(todo, cb);



}

function create(event, bet, user, callback){

    var todo = [];
    var pick = {};

    function createPick(callback){
        pick = {
            event: event._id,
            sport: event.sport.ref._id,
            league: event.league.ref,
            bet: bet._id,
            user: {name: user.username, ref: user._id},
            altLine: bet.altLine,
            otIncluded: bet.otIncluded,

            betType: bet.betType,
            betDuration: bet.betDuration,

            odds: bet.odds,
            units: bet.units,
            eventStartTime: event.startTime
        };
        callback();
    }

    function addAdditionalInfo(callback){
        switch(bet.betType){
            case 'spread':
                pick.spread = bet.spread;
                pick.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                break;
            case 'total points':
                pick.points = bet.points;
                pick.overUnder = bet.overUnder;
                break;
            case 'team totals':
                pick.points = bet.points;
                pick.overUnder = bet.overUnder;
                pick.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                break;
            case 'moneyline':
                if(bet.draw){
                    pick.draw = true;
                } else {
                    pick.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                    pick.underdog = bet.underdog;
                }
                break;
            case 'sets':
                pick.spread = bet.spread;
                pick.contestant = {name: bet.contestant.name, ref: bet.contestant.ref};
                break;
        }
        callback();
    }

    function addHomeAway(callback){
        if('contestant' in pick){
            if(!event.neutral){
                if(String(pick.contestant.ref) === String(event.contestant1.ref)) {
                    pick.contestant.homeAway = 'home';
                } else if (String(pick.contestant.ref) === String(event.contestant2.ref)){
                    pick.contestant.homeAway = 'away';
                }
            }
        }
        callback();
    }

    function createSlug(callback){

        var currentTime = new Date().toString().split(' ');
        var dateString = currentTime[1]+' '+currentTime[2]+' '+currentTime[3]+'--'+currentTime[4].substring(0, currentTime[4].length - 3);
        var betString = pick.betDuration + ' '+ pick.betType;

        switch(pick.betType){
            case 'moneyline':
                if(pick.draw){
                    betString = betString+' draw';
                } else {
                    betString = betString + ' ' + pick.contestant.name;
                }
                break;
            case 'spread':
                if(pick.draw){
                    betString = betString+' draw '+pick.spread;
                } else {
                    betString = betString+' '+pick.contestant.name+' '+pick.spread;
                }
                break;
            case 'total points':
                betString = betString+' '+event.contestant1.name+'-vs-'+event.contestant2.name+' '+pick.overUnder+' '+pick.points;
                break;
            case 'team totals':
                betString = betString+' '+pick.contestant.name+' '+pick.overUnder+' '+pick.points;
                break;
            case 'sets':
                betString = betString+' '+pick.overUnder+' '+pick.spread;
                break;
        }
        pick.slug = slug(betString+' '+dateString);
        callback();

    }

    function checkCopiedFrom(callback){
        if('copiedFrom' in bet){
            pick.copiedFrom = bet.copiedFrom;
            pick.copiedOrigin = bet.copiedOrigin;
        }
        callback();
    }


    function getPickStats(callback){
        function cb(err, stats){
            pick.userStats = stats;
            callback(err);
        }

        getStats(pick, cb);
    }

    function checkPremium(callback){

        function cb(premium, premiumTypes, premiumStats){
            pick.premium = premium;
            if(premium){
                pick.premiumTypes = premiumTypes;
                pick.premiumStats = premiumStats;
            }

            function cb_pickSave(err){
                if(err) return callback(err, null);

                if('copiedFrom' in bet){
                    addCopy(user, bet.copiedFrom.pick);
                    addCopy(user, bet.copiedOrigin.pick);
                    //notification.newNotification('pick copied', pick);
                }
                callback(err, pick);

            }

            PickBl.create(pick, cb_pickSave);
        }

        isPremium(event, user, cb);

    }


    todo.push(createPick);
    todo.push(addAdditionalInfo);
    todo.push(addHomeAway);
    todo.push(createSlug);
    todo.push(checkCopiedFrom);
    todo.push(getPickStats);
    todo.push(checkPremium);

    async.waterfall(todo, callback);
}

exports.create = create;