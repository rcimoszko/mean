'use strict';

var _ = require('lodash'),
    async = require('async'),
    HotpickBl = require('./hotpick.server.bl'),
    ConsensusBl = require('./consensus.server.bl'),
    LeaderboardBl = require('./leaderboard.server.bl'),
    CommentPreviewsBl = require('./comment.previews.server.bl'),
    ChannelEventsBl = require('./channel.events.server.bl'),
    TrendingBl = require('./trending.server.bl'),
    mongoose = require('mongoose');

function getHotPick(query, callback){
    HotpickBl.getHotPick(query.sportId, query.leagueId, callback);
}

function getConsensus(query, callback){
    ConsensusBl.getConsensus(query.sportId, query.leagueId, 3, callback);
}

function getLeaderboard(query, callback){
    LeaderboardBl.buildLeaderboard('last30Days', query.sportId, query.leagueId, 'all', 'both', 'all', 'all', null, null, 5, callback);
}

function getDiscussion(query, callback){
    query.count = 5;
    CommentPreviewsBl.getPreviews(query, callback);
}

function getTrending(query, callback){
    query.dateId = 'last30Days';
    query.count = 5;
    TrendingBl.get(query, callback);
}

function get(channel, user, date, callback){

    var query = {sportId: 'all', leagueId:'all'};
    switch(channel.type){
        case 'sport':
            query.sportId = channel.sport.ref;
            break;
        case 'league':
            query.leagueId = channel.league.ref;
            break;

    }

    function getChannel_todo(callback){
        callback(null, channel);
    }

    function getHotPick_todo(callback){
        getHotPick(query, callback);
    }

    function getConsensus_todo(callback){
        getConsensus(query, callback);
    }

    function getLeaderboard_todo(callback){
        getLeaderboard(query, callback);
    }

    function getTrending_todo(callback){
        getTrending(query, callback);
    }

    function getDiscussion_todo(callback){
        getDiscussion(query, callback);
    }

    function getChannelEvents_todo(callback){
        ChannelEventsBl.get(channel, user, date, callback);
    }

    var todo = {
        channel: getChannel_todo,
        hotPick: getHotPick_todo,
        consensus: getConsensus_todo,
        leaderboard: getLeaderboard_todo,
        trending: getTrending_todo,
        discussion: getDiscussion_todo,
        eventGroups: getChannelEvents_todo
    };

    async.parallel(todo, callback);

}


exports.getHotPick = getHotPick;
exports.getConsensus = getConsensus;
exports.getLeaderboard = getLeaderboard;
exports.getTrending = getTrending;

exports.get       = get;