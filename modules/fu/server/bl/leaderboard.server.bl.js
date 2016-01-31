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


function get(query, callback){

    var leaderboardQuery = {};
    var minBets = query.minBets;

    var todo = [];

    function createLeaderboardQuery(callback){
        var dateId       = query.dateId;
        var sportId      = query.sportId;
        var leagueId     = query.leagueId;
        var contestantId = query.contestantId;
        var homeAway     = query.homeAway;
        var betDuration  = query.betDuration;
        var betType      = query.betType;

        leaderboardQuery = LeaderboardQueryBl.getLeaderboardQueryNew(dateId, sportId, leagueId, contestantId, homeAway, betDuration, betType);
        callback();

    }

    function getLeaderboard(callback){
        var match = {$match: leaderboardQuery};
        match.$match.result = {$ne: 'Pending' };
        var project =  {$project:{_id:1, avgOdds:1, avgBet:1, units:1, profit:1, wins:1, losses:1, pending:1, roi: { $multiply:[{$divide: [ '$profit', '$units' ]}, 100]}}};

        var aggregate = [];
        aggregate.push(match);
        aggregate.push(project);

        PickBl.aggregate(aggregate, callback);
    }

    function getPendingPicks(callback){

    }

    function mergeTables(callback){

    }

    todo.push(createLeaderboardQuery);
    todo.push(getLeaderboard);

    async.waterfall(todo, callback);


}

exports.get            = get;
exports.getSports      = getSports;
exports.getLeagues     = getLeagues;
exports.getContestants = getContestants;