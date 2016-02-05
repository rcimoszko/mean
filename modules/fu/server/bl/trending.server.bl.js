'use strict';

var mongoose = require('mongoose'),
    DateQueryBl = require('./date.query.server.bl'),
    FollowBl = require('./follow.server.bl'),
    LeaderboardBl = require('./leaderboard.server.bl'),
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
    LeaderboardBl.buildLeaderboard(dateId, sportId, leagueId, 'all', 'both', 'all', 'all', null, null, callback);
}

function getWinStreak(dateId, sportId, leagueId, callback){
    callback(null, null);
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
        var trending = {followers: results.followers.splice(0,count), profit: results.profit.splice(0,count), streak: []};
        callback(err, trending);
    }

    async.parallel(todo, cb);

}

exports.get            = get;