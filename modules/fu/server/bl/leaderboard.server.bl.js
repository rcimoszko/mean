'use strict';

var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Pick = mongoose.model('Pick'),
    path = require('path'),
    SportBl = require('./sport.server.bl'),
    LeagueBl = require('./league.server.bl'),

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
    callback(null);
}

exports.get            = get;
exports.getSports      = getSports;
exports.getLeagues     = getLeagues;
exports.getContestants = getContestants;