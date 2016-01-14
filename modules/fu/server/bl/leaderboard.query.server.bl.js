'use strict';

var mongoose = require('mongoose');


function getDateQuery(dateId){
    var today = new Date();
    var timeIntervalStart = new Date();
    var timeIntervalEnd = new Date();
    switch (dateId){
        case 'last24Hours':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-1);
            break;
        case 'last7Days':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-7);
            break;
        case 'thisMonth':
            timeIntervalStart.setHours(timeIntervalStart.getHours()-7);
            timeIntervalStart = new Date(timeIntervalStart.getFullYear(), timeIntervalStart.getMonth(), 1, 0, 0);
            timeIntervalStart.setHours(timeIntervalStart.getHours()+7);
            break;
        case 'lastMonth':
            timeIntervalStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0);
            timeIntervalStart.setHours(timeIntervalStart.getHours()+8);
            timeIntervalEnd = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0);
            timeIntervalEnd.setHours(timeIntervalEnd.getHours()+8);
            break;
        case 'last30Days':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-30);
            break;
        case 'last60Days':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-60);
            break;
        case 'last90Days':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-90);
            break;
        case 'last6Months':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-180);
            break;
    }

    var query = {};


    if(dateId === 'allTime'){
        query = {$lte: timeIntervalEnd};
    } else {
        query = {$lte: timeIntervalEnd, $gte: timeIntervalStart};
    }
    return query;
}

function getLeaderboardQuery(pendingCompleted, dateId, filterType, filterId, betType, homeAway) {
    var query = {};
    var dateQuery = {};

    switch (pendingCompleted) {
        case 'completed':
            dateQuery = getDateQuery(dateId);
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

exports.getDateQuery = getDateQuery;
exports.getLeaderboardQuery = getLeaderboardQuery;