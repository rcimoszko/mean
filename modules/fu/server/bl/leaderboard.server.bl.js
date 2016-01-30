'use strict';

var mongoose = require('mongoose'),
    League = mongoose.model('League'),
    Pick = mongoose.model('Pick'),
    path = require('path'),
    _ = require('lodash'),
    async = require('async');

function getSports(callback){

}
function getLeagues(sportId, callback){

}
function getContestants(leagueId, callback){

}


function get(query, callback){
    callback(null);
}

exports.get            = get;
exports.getSports      = getSports;
exports.getLeagues     = getLeagues;
exports.getContestants = getContestants;