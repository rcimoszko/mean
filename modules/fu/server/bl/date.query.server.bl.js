'use strict';

var mongoose = require('mongoose'),
    TimezoneBl = require('./timezone.server.bl');

function getDateQuery(dateId){

    var tzAdjust = TimezoneBl.timezoneAdjust;
    var today = new Date();
    var timeIntervalStart = new Date();
    var timeIntervalEnd = new Date();
    switch (dateId){
        case 'last24Hours':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-1);
            break;
        case 'last7Days':
            timeIntervalStart.setDate(timeIntervalStart.getDate()-tzAdjust);
            break;
        case 'thisMonth':
            timeIntervalStart.setHours(timeIntervalStart.getHours()-tzAdjust);
            timeIntervalStart = new Date(timeIntervalStart.getFullYear(), timeIntervalStart.getMonth(), 1, 0, 0);
            timeIntervalStart.setHours(timeIntervalStart.getHours()+tzAdjust);
            break;
        case 'lastMonth':
            timeIntervalStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0);
            timeIntervalStart.setHours(timeIntervalStart.getHours()+tzAdjust+1);
            timeIntervalEnd = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0);
            timeIntervalEnd.setHours(timeIntervalEnd.getHours()+tzAdjust+1);
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

exports.getDateQuery = getDateQuery;