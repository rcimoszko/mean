'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    SportBl = require('./sport.server.bl'),
    LeagueBl = require('./league.server.bl'),
    EventBl = require('./event.server.bl'),
    ContestantBl = require('./contestant.server.bl'),
    BetBl = require('./bet.server.bl'),
    PickBl = require('./pick.server.bl');


function processBetGeneric(processBet, callback){

    function processLeague(league, callback){

        function cb(err, bets){
            async.eachSeries(bets, processBet, callback);
        }

        BetBl.getByLeague(league, cb);
    }

    processLeagueGeneric(processLeague, callback);
}

function processPickGeneric(processPick, callback){

    function processLeague(league, callback){

        function cb(err, picks){
            async.eachSeries(picks, processPick, callback);
        }

        PickBl.getByLeague(league, cb);
    }

    processLeagueGeneric(processLeague, callback);
}

function processContestantGeneric(processContestant, callback){

    function processLeague(league, callback){

        function cb(err, contestants){
            async.eachSeries(contestants, processContestant, callback);
        }

        ContestantBl.getByLeague(league, cb);
    }

    processLeagueGeneric(processLeague, callback);
}

function processEventGeneric(processEvent, callback){

    function processLeague(league, callback){

        function cb(err, events){
            async.eachSeries(events, processEvent, callback);
        }

        EventBl.getByLeague(league, cb);
    }

    processLeagueGeneric(processLeague, callback);
}

function processLeagueGeneric(processLeague, callback){

    function processSport(sport, callback){

        function cb(err, leagues){
            async.eachSeries(leagues, processLeague, callback);
        }

        LeagueBl.getBySport(sport, cb);
    }

    processSportGeneric(processSport, callback);
}

function processSportGeneric(processSport, callback){
    var todo = [];

    function getSports(callback){
        SportBl.getAll(callback);
    }

    function processSports(sports, callback){
        async.eachSeries(sports, processSport, callback);

    }

    todo.push(getSports);
    todo.push(processSports);

    async.waterfall(todo, callback);
}

exports.processSportGeneric         = processSportGeneric;
exports.processLeagueGeneric        = processLeagueGeneric;
exports.processEventGeneric         = processEventGeneric;
exports.processContestantGeneric    = processContestantGeneric;
exports.processPickGeneric          = processPickGeneric;
exports.processBetGeneric           = processBetGeneric;