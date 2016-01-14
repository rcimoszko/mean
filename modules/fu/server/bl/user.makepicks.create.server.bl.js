'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    Bet = mongoose.model('Bet'),
    Pick = mongoose.model('Pick'),
    User = mongoose.model('User'),
    slug = require('speakingurl'),
    PickBl = require('./pick.server.bl'),
    LeaderboardQueryBl = require('./leaderboard.query.server.bl');


function addCopy(user, bet){
    Pick.update({_id:bet}, {$addToSet:{copied: {name: user.username, ref: user._id}}}).exec(function(err, numAffected){
        if(err){
            console.log(err);
        }
    });
}


function getRanking(user, filterType, filterId, dateId, minBets, minProfit, callback){
    var leaderboardQuery = LeaderboardQueryBl.getLeaderboardQuery('completed', dateId, filterType, String(filterId), 'all', 'both');

    Pick.aggregate([
        leaderboardQuery,
        {
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
        },
        {
            $sort : {profit: -1}
        },
        { $match:{
            betCount: { $gt: minBets },
            profit: { $gt: minProfit }
        }
        }
    ]).exec(function(err, leaderboard){
        var rank = _.findIndex(leaderboard, { _id: user._id });
        if(rank !== -1){
            var ranking = leaderboard[rank];
            ranking.rank = rank+1;
            callback(ranking);
        } else {
            callback(null);
        }
    });
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
            sport: event.sport.ref,
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
    todo.push(checkPremium);

    async.waterfall(todo, callback);
}

exports.create = create;