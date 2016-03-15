'use strict';

var mongoose = require('mongoose'),
    DateQueryBl = require('./date.query.server.bl');

function getLeaderboardQuery(pendingCompleted, dateId, filterType, filterId, betType, homeAway) {
    var query = {};
    var dateQuery = {};

    switch (pendingCompleted) {
        case 'completed':
            dateQuery = DateQueryBl.getDateQuery(dateId);
            query = {$match: {result: { $ne: 'Pending' }, eventStartTime: dateQuery }};
            break;
        case 'pending':
            query = {$match: {result: 'Pending' }};
            break;
    }

    if (filterType !== 'all')    query.$match[filterType] = mongoose.Types.ObjectId(filterId);
    if (betType !== 'all')       query.$match.betType = betType;
    if (homeAway !== 'both')     query.$match['contestant.homeAway'] = homeAway;
    return query;
}

function getLeaderboardQueryNew(dateId, sportId, leagueId, contestantId, homeAway, betDuration, betType){
    var query = {};
    query.eventStartTime =      DateQueryBl.getDateQuery(dateId);
    if(sportId !== 'all')       query.sport = mongoose.Types.ObjectId(sportId);
    if(leagueId !== 'all')      query.league = mongoose.Types.ObjectId(leagueId);
    if(contestantId !== 'all')  query['contestant.ref'] = mongoose.Types.ObjectId(contestantId);
    if(betType !== 'all')       query.betType = betType;
    if(homeAway !== 'both')     query['contestant.homeAway'] = homeAway;
    if(betDuration !== 'all')   query.betDuration = betDuration;

    return query;
}

exports.getLeaderboardQuery = getLeaderboardQuery;
exports.getLeaderboardQueryNew = getLeaderboardQueryNew;