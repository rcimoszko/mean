'use strict';

var mongoose = require('mongoose'),
    async = require('async');


function getMostFollowers(dateId, callback){

}

function getMostProfit(dateId, sportId, leagueId, callback){

}

function get(query, callback){

    var dateId       = query.dateId;
    var sportId      = query.sportId;
    var leagueId     = query.leagueId;

    function getMostFollowers_todo(callback){
        getMostFollowers(dateId, callback);
    }

    function getMostProfit_todo(callback){
        getMostProfit(dateId, sportId, leagueId, callback);
    }

    function getWinStreak_todo(callback){
        getMostProfit(dateId, sportId, leagueId, callback);
    }

    var todo = {followers: getMostFollowers_todo, profit: getMostProfit_todo, streak: getWinStreak_todo};

    async.parallel(todo, callback);

}

exports.get            = get;