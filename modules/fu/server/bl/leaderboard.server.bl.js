'use strict';

var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Pick = mongoose.model('Pick'),
    path = require('path'),
    SportBl = require('./sport.server.bl'),
    LeagueBl = require('./league.server.bl'),
    PickBl = require('./pick.server.bl'),
    LeaderboardQueryBl = require('./leaderboard.query.server.bl'),
    ContestantBl = require('./contestant.server.bl'),
    _ = require('lodash'),
    async = require('async');

function getSports(callback){
    var query = {pickMade:true};
    SportBl.getByQuery(query, callback);
}

function getLeagues(sportId, dateId, callback){
    var query = {'sport.ref': sportId};
    query['leaderboardActive.'+dateId] = true;
    LeagueBl.getByQuery(query, callback);
}

function getContestants(leagueId, callback){
    ContestantBl.getByLeagueId(leagueId, callback);
}


function buildLeaderboard(dateId, sportId, leagueId, contestantId, homeAway, betDuration, betType, minBets, userArray, callback){
    var todo = [];
    var leaderboardQuery = LeaderboardQueryBl.getLeaderboardQueryNew(dateId, sportId, leagueId, contestantId, homeAway, betDuration, betType);

    function createLeaderboard(callback){

        function getLeaderboard(callback){
            var match = {$match: leaderboardQuery};
            if(userArray)leaderboardQuery['user.ref'] = {$in: userArray};
            match.$match.result = {$ne: 'Pending' };
            var group = {$group:{
                _id: '$user.ref',
                avgOdds: { $avg: '$odds' },
                avgBet: { $avg: '$units' },
                units: {$sum: '$units'},
                profit: {$sum: '$profit'},
                wins: {$sum: {$cond: [{$gt:['$profit', 0]}, 1, 0]}},
                losses: {$sum: {$cond: [{$lt:['$profit', 0]}, 1, 0]}},
                pending: {$sum: 0},
                count: {$sum: 1}
            }};
            var project =  {$project:{user:'$_id', avgOdds:1, avgBet:1, units:1, profit:1, wins:1, losses:1, pending:1, count:1, roi: { $multiply:[{$divide: [ '$profit', '$units' ]}, 100]}}};
            var sort = {$sort:{profit:-1}};
            var aggregate = [];
            aggregate.push(match);
            aggregate.push(group);
            aggregate.push(project);
            aggregate.push(sort);

            PickBl.aggregate(aggregate, callback);
        }

        function getPendingPicks(callback){
            var match = {$match: leaderboardQuery};
            match.$match.result = 'Pending';
            var group = {$group:{ _id: '$user.ref',  pending: { $sum: 1 }}};

            var aggregate = [];
            aggregate.push(match);
            aggregate.push(group);

            PickBl.aggregate(aggregate, callback);

        }

        function done(err, results){
            var leaderboard = results.leaderboard;
            var pendingPicks = results.pendingPicks;
            for(var i=0; i<leaderboard.length; i++){
                for(var j=0; j<pendingPicks.length; j++){
                    if(String(leaderboard[i]._id) === String(pendingPicks[j]._id)){
                        leaderboard[i].pending = pendingPicks[j].pending;
                    }
                }
            }

            callback(null, leaderboard);
        }

        var todo = {leaderboard: getLeaderboard, pendingPicks: getPendingPicks};
        async.parallel(todo, done);
    }

    function filterMinBets(leaderboard, callback){
        if(minBets !== 'all'){
            leaderboard = _.filter(leaderboard, function(user){
                return user.count > minBets;
            });
        }
        callback(null, leaderboard);
    }

    function populateUser(leaderboard, callback){
        var populate = {path: 'user', model:'User', select: 'username avatarUrl'};
        PickBl.populateBy(leaderboard, populate, callback);
    }

    todo.push(createLeaderboard);
    if(minBets) todo.push(filterMinBets);
    todo.push(populateUser);

    async.waterfall(todo, callback);

}

function get(query, callback){

    var minBets      = query.minBets;
    var dateId       = query.dateId;
    var sportId      = query.sportId;
    var leagueId     = query.leagueId;
    var contestantId = query.contestantId;
    var homeAway     = query.homeAway;
    var betDuration  = query.betDuration;
    var betType      = query.betType;

    buildLeaderboard(dateId, sportId, leagueId, contestantId, homeAway, betDuration, betType, minBets, null, callback);

}

exports.get            = get;
exports.getSports      = getSports;
exports.getLeagues     = getLeagues;
exports.getContestants = getContestants;
exports.buildLeaderboard = buildLeaderboard;