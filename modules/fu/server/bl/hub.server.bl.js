'use strict';

var _ = require('lodash'),
    async = require('async'),
    HotpickBl = require('./hotpick.server.bl'),
    ConsensusBl = require('./consensus.server.bl'),
    PopularBl = require('./popular.server.bl'),
    ChatBl = require('./chat.server.bl'),
    LeaderboardBl = require('./leaderboard.server.bl'),
    PickListBl = require('./pick.list.server.bl'),
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
    LeaderboardBl.buildLeaderboard('thisMonth', 'all', 'all', 'all', 'both', 'all', 'all', null, null, 5, callback);
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

function getChat(callback){
    ChatBl.getHubChat(callback);
}

function get(callback){
    var todo = {
        hotPick: getHotPick,
        consensus: getConsensus,
        popular: getPopularGames,
        leaderboard: getLeaderboard,
        chat: getChat,
        trending: getTrending
    };

    async.parallel(todo, callback);

}

function getPicks(query, user, callback){
    var pageLimit = 100;
    var page = query.page;
    var pendingCompleted = query.type;
    var pro = query.pro;

    PickListBl.getEventPickList('all', 'all', null, pro, page, pageLimit, 2, pendingCompleted, user._id, user.premium || user.trial, callback);

}

exports.getHotPick = getHotPick;
exports.getConsensus = getConsensus;
exports.getPopularGames = getPopularGames;
exports.getLeaderboard = getLeaderboard;
exports.getTrending = getTrending;

exports.get = get;
exports.getPicks = getPicks;