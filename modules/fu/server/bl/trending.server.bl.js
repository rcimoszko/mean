'use strict';

var mongoose = require('mongoose'),
    DateQueryBl = require('./date.query.server.bl'),
    FollowBl = require('./follow.server.bl'),
    LeaderboardBl = require('./leaderboard.server.bl'),
    PickBl = require('./pick.server.bl'),
    LeaderboardQueryBl = require('./leaderboard.query.server.bl'),
    _ = require('lodash'),
    async = require('async');


function getMostFollowers(dateId, callback){

    var todo = [];

    function getFollowerList(callback){
        var aggArray = [];
        var match = {$match: {startDate: DateQueryBl.getDateQuery(dateId)}};
        var group = {$group: {_id: '$following', count: {$sum:1}}};
        var sort =  {$sort: {'count': -1}};
        var project = {$project:{user:'$_id', count:1}};

        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(sort);
        aggArray.push(project);

        FollowBl.aggregate(aggArray, callback);
    }

    function populateUsers(followList, callback){
        var populate = {path: 'user.ref', model:'User', select: 'username avatarUrl'};
        FollowBl.populateBy(followList, populate, callback);
    }

    todo.push(getFollowerList);
    todo.push(populateUsers);

    async.waterfall(todo, callback);


}

function getMostProfit(dateId, sportId, leagueId, callback){
    LeaderboardBl.buildLeaderboard(dateId, sportId, leagueId, 'all', 'both', 'all', 'all', null, null, null, callback);
}

function getWinStreak(dateId, sportId, leagueId, callback){
    var todo = [];

    function getResults(callback){
        var query = LeaderboardQueryBl.getLeaderboardQueryNew(dateId, sportId, leagueId, 'all', 'both', 'all', 'all');
        query.result = { $ne: 'Pending' };
        var match = {$match: query};
        var sort =  {$sort: {eventStartTime: 1, timeResolved:-1}};
        var group =  {$group: { _id: '$user',  results: {$push: '$result'}}};
        var project = {$project:{user:'$_id', results:1}};

        var aggArray = [];
        aggArray.push(match);
        aggArray.push(sort);
        aggArray.push(group);
        aggArray.push(project);

        PickBl.aggregate(aggArray, callback);
    }

    function calculateWinStreak(userList, callback){
        for(var i=0; i<userList.length; i++){
            userList[i].winStreak = 0;
            for(var j=0; j<userList[i].results.length; j++){
                if(userList[i].results[j].toLowerCase().indexOf('win') !== -1){
                    userList[i].winStreak++;
                } else{
                    userList[i].winStreak = 0;
                }
            }
        }
        userList = _.sortBy(userList, function(user){
            return -1*user.winStreak;
        });
        callback(null, userList);
    }

    function cleanData(userList, callback){
        for(var i=0; i<userList.length; i++){
            userList[i].results = undefined;
        }
        callback(null, userList);
    }

    function populateUser(userList, callback){
        var populate = {path: 'user.ref', model:'User', select: 'username avatarUrl'};
        PickBl.populateBy(userList, populate, callback);
    }

    todo.push(getResults);
    todo.push(calculateWinStreak);
    todo.push(cleanData);
    todo.push(populateUser);

    async.waterfall(todo, callback);

}

function get(query, callback){

    var dateId       = query.dateId;
    var sportId      = query.sportId;
    var leagueId     = query.leagueId;
    var count     = query.count;

    function getMostFollowers_todo(callback){
        getMostFollowers(dateId, callback);
    }

    function getMostProfit_todo(callback){
        getMostProfit(dateId, sportId, leagueId, callback);
    }

    function getWinStreak_todo(callback){
        getWinStreak(dateId, sportId, leagueId, callback);
    }

    var todo = {followers: getMostFollowers_todo, profit: getMostProfit_todo, streak: getWinStreak_todo};

    function cb(err, results){
        var trending = {followers: results.followers.splice(0,count), profit: results.profit.splice(0,count), streak: results.streak.splice(0,count)};
        callback(err, trending);
    }

    async.parallel(todo, cb);

}

exports.get            = get;