'use strict';

var _ = require('lodash'),
    async = require('async'),
    HotpickBl = require('./hotpick.server.bl'),
    ConsensusBl = require('./consensus.server.bl'),
    PopularBl = require('./popular.server.bl'),
    LeaderboardBl = require('./leaderboard.server.bl'),
    TrendingBl = require('./trending.server.bl'),
    mongoose = require('mongoose');

function getHotPick(callback){
    HotpickBl.getHotPick('all', 'all', callback);
}

function getConsensus(callback){
    ConsensusBl.getConsensus('all', 'all', 3, callback);
}

function getPopularGames(callback){
    PopularBl.getPopularGames('all', 'all', 2, callback);
}

function getLeaderboard(callback){
    LeaderboardBl.buildLeaderboard('last30Days', 'all', 'all', 'all', 'both', 'all', 'all', null, null, 5, callback);
}

function getTrending(callback){
    var query = {
        dateId: 'last30Days',
        sportId: 'all',
        leagueId: 'all',
        count: 5
    };
    TrendingBl.get(query, callback);
}

function get(callback){
    var todo = {
        hotPick: getHotPick,
        consensus: getConsensus,
        popular: getPopularGames,
        leaderboard: getLeaderboard,
        trending: getTrending
    };

    async.parallel(todo, callback);

}

exports.getHotPick = getHotPick;
exports.getConsensus = getConsensus;
exports.getPopularGames = getPopularGames;
exports.getLeaderboard = getLeaderboard;
exports.getTrending = getTrending;

exports.get = get;