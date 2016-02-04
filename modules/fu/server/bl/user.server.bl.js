'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    PickBl = require('./pick.server.bl'),
    FollowBl = require('./follow.server.bl'),
    LeaderboardBl = require('./leaderboard.server.bl'),
    User = mongoose.model('User');


function getByUsername(username, callback){

    function cb(err, user){
        callback(err, user);
    }

    User.findOne({'username':{ $regex: new RegExp(username, 'i')}}).exec(cb);
}


function getFollowing(user, query, callback){
    var todo = [];
    var dateId = query.dateId;
    var leagueId = query.leagueId;
    var sportId = query.sportId;
    var followingIdArray = [];
    var followingList = [];

    function getFollowingList_todo(callback){
        function cb(err, list){
            followingList = list;
            callback(err);
        }
        FollowBl.getFollowingList(user._id, cb);
    }

    function getFollowingLeaderboard(callback){
        function cb(err, followingLeaderboard){
            callback(err, followingLeaderboard);
        }

        followingIdArray = _.chain(followingList).pluck('_id').value();
        LeaderboardBl.buildLeaderboard(dateId, sportId, leagueId, 'all', 'both', 'all', 'all', null, followingIdArray, cb);
    }

    function mergeFollowingListAndLeaderboard(followingLeaderboard, callback){
        var currentUser;
        function findInLeaderboard(leaderboard){
            return String(leaderboard.user._id) === String(currentUser._id);
        }

        for(var i=0; i<followingList.length; i++){
            currentUser = followingList[i];
            var found = _.find(followingLeaderboard, findInLeaderboard);
            followingList[i] =  followingList[i].toJSON();
            if(found){
                followingList[i].avgOdds = found.avgOdds;
                followingList[i].avgBet = found.avgBet;
                followingList[i].units = found.units;
                followingList[i].profit = found.profit;
                followingList[i].roi = found.roi;
                followingList[i].wins = found.wins;
                followingList[i].losses = found.losses;
                followingList[i].pending = found.pending;
            } else {
                followingList[i].avgOdds = 0;
                followingList[i].avgBet = 0;
                followingList[i].units =  0;
                followingList[i].roi = 0;
                followingList[i].profit = 0;
                followingList[i].wins = 0;
                followingList[i].losses = 0;
                followingList[i].pending = 0;
            }
        }
        callback();
    }

    function getFollowingPicks(callback){
        var query = {'user.ref': {$in:followingIdArray}, result:'Pending'};
        if(sportId !== 'all') query.sport = sportId;
        if(leagueId !== 'all') query.league = leagueId;

        PickBl.getGroupedByUser(query, callback);
    }

    function addPicksToList(userPendingPicks, callback){
        for(var i=0; i<followingList.length; i++){
            if(followingList[i]._id in userPendingPicks){
                followingList[i].eventPicks = userPendingPicks[followingList[i]._id];
            } else {
                followingList[i].eventPicks = [];
            }
        }
        callback();
    }

    function cb(err){
        callback(err, followingList);
    }

    todo.push(getFollowingList_todo);
    todo.push(getFollowingLeaderboard);
    todo.push(mergeFollowingListAndLeaderboard);
    todo.push(getFollowingPicks);
    todo.push(addPicksToList);

    async.waterfall(todo, cb);

}

function getHub(user, callback){
    callback(null);
}

function getMessages(user, callback){
    callback(null);
}

function getNotifications(user, callback){
    callback(null);
}

function getPendingPicks(user, callback){
    var query = {'user.ref': user._id, result: 'Pending'};
    PickBl.getPending(query, callback);
}



function getCompletedPicks(user, callback){
    var todo = [];

    function getPicks(callback){
        var query = {'user.ref': user._id, result: {$ne:'Pending'}};
        PickBl.getCompleted(query, callback);
    }

    function assignScores(picks, callback){
        var processedPicks = [];

        function assignScore(pick, callback){
            pick = pick.toJSON();
            switch(pick.betDuration){
                case 'game':
                case 'game (OT included)':
                case 'match':
                case 'fight':
                case 'matchups':
                case 'race':
                    pick.contestant1Score = pick.event.contestant1FinalScore;
                    pick.contestant2Score = pick.event.contestant2FinalScore;
                    break;
                case '1st half':
                case '1st 5 innings':
                case '1st end':
                    pick.contestant1Score = pick.event.contestant1H1Score;
                    pick.contestant2Score = pick.event.contestant2H1Score;
                    break;
                case '1st game':
                case '1st set':
                case '1st inning':
                case '1st leg':
                case '1st map':
                case '1st frame':
                case '1st set winner':
                    pick.contestant1Score = pick.event.contestant1Set1Score;
                    pick.contestant2Score = pick.event.contestant2Set1Score;
                    break;
                case '1st period':
                    pick.contestant1Score = pick.event.contestant1P1Score;
                    pick.contestant2Score = pick.event.contestant2P1Score;
                    break;
                case '1st quarter':
                    pick.contestant1Score = pick.event.contestant1Q1Score;
                    pick.contestant2Score = pick.event.contestant2Q1Score;
                    break;
                case 'game (regular time)':
                    pick.contestant1Score = pick.event.contestant1RegulationScore;
                    pick.contestant2Score = pick.event.contestant2RegulationScore;
                    break;
                case '2nd game':
                case '2nd set':
                case '2nd inning':
                case '2nd leg':
                    pick.contestant1Score = pick.event.contestant1Set2Score;
                    pick.contestant2Score = pick.event.contestant2Set2Score;
                    break;
                case '2nd quarter':
                    pick.contestant1Score = pick.event.contestant1Q2Score;
                    pick.contestant2Score = pick.event.contestant2Q2Score;
                    break;
                case '2nd period':
                    pick.contestant1Score = pick.event.contestant1P2Score;
                    pick.contestant2Score = pick.event.contestant2P2Score;
                    break;
                case '2nd half':
                case '2nd set winner':
                    pick.contestant1Score = pick.event.contestant1H2Score;
                    pick.contestant2Score = pick.event.contestant2H2Score;
                    break;
                case '3rd game':
                case '3rd set':
                case '3rd leg':
                case '3rd set winner':
                    pick.contestant1Score = pick.event.contestant1Set3Score;
                    pick.contestant2Score = pick.event.contestant2Set3Score;
                    break;
                case '3rd quarter':
                    pick.contestant1Score = pick.event.contestant1Q3Score;
                    pick.contestant2Score = pick.event.contestant2Q3Score;
                    break;
                case '3rd period':
                    pick.contestant1Score = pick.event.contestant1P3Score;
                    pick.contestant2Score = pick.event.contestant2P3Score;
                    break;
                case '4th quarter':
                    pick.contestant1Score = pick.event.contestant1Q4Score;
                    pick.contestant2Score = pick.event.contestant2Q4Score;
                    break;
                case '4th set':
                case '4th leg':
                case '4th game':
                case '4th set winner':
                case '4th period':
                    pick.contestant1Score = pick.event.contestant1Set4Score;
                    pick.contestant2Score = pick.event.contestant2Set4Score;
                    break;
                case '5th set':
                case '5th leg':
                case '5th game':
                case '5th set winner':
                    pick.contestant1Score = pick.event.contestant1Set5Score;
                    pick.contestant2Score = pick.event.contestant2Set5Score;
                    break;

            }
            if(pick.contestant1Score > pick.contestant2Score){
                pick.winner = 1;
            } else if(pick.contestant2Score > pick.contestant1Score){
                pick.winner = 2;
            } else {
                pick.winner = 'draw';
            }

            processedPicks.push(pick);

            callback();
        }
        function cb(err){
            callback(err, processedPicks);
        }

        async.each(picks, assignScore, cb);

    }

    todo.push(getPicks);
    todo.push(assignScores);

    async.waterfall(todo, callback);

}

function getTracker(user, callback){
    callback(null);
}


exports.getByUsername       = getByUsername;
exports.getFollowing        = getFollowing;
exports.getHub              = getHub;
exports.getMessages         = getMessages;
exports.getNotifications    = getNotifications;
exports.getPendingPicks     = getPendingPicks;
exports.getCompletedPicks   = getCompletedPicks;
exports.getTracker          = getTracker;