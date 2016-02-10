'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    CommentBl = require('./comment.server.bl');



function getPreviews(query, callback){
    var todo = [];

    var sportId = query.sportId;
    var leagueId = query.leagueId;
    var eventId = query.eventId;
    var pickId = query.pickId;
    var count = query.count;

    var previewQuery = {sport: {$exists: true}};
    if(sportId && sportId !== 'all')    previewQuery.sport = sportId;
    if(leagueId && leagueId !== 'all')  previewQuery.league = leagueId;
    if(eventId)                         previewQuery.event = event;
    if(pickId)                          previewQuery.pick = pickId;

    var limit = 5;
    if(count) limit = count;

    CommentBl.getPreviews(previewQuery, limit, callback);

}

exports.getPreviews = getPreviews;