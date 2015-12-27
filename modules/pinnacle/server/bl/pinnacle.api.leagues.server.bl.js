'use strict';

var mongoose = require('mongoose'),
    LeagueBl = require('../../../fu/server/bl/league.server.bl'),
    SportsbookBl = require('../../../fu/server/bl/sportsbook.server.bl'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    PinSportBl = require('./pinnacleSport.server.bl'),
    PinLeagueBl = require('./pinnacleLeague.server.bl'),
    async = require('async');


var excludeLeagueTypes = [
    'Alternate',
    'Corner',
    'Bookings'
];


function createLeagues(leagueApi, pinnacleSport, pinnacleSportsbook, callback){

    var name = leagueApi._;
    var id = parseInt(leagueApi.$.id);
    var active = parseInt(leagueApi.$.feedContents);

    var todo = [];

    function createLeague(callback){
        var league = {
            name: name,
            active: active,
            primarySportsbook: pinnacleSportsbook,
            sport: {name: pinnacleSport.sport.name, ref: pinnacleSport.sport.ref}
        };

        LeagueBl.create(league, callback);
    }

    function createPinnacleLeague(league, callback){
        var pinnacleLeague = {
            name: name,
            active: active,
            leagueId: id,
            sportId: pinnacleSport.sportId,
            last: null,
            league: {name: league.name, ref: league._id},
            sport: {name: pinnacleSport.sport.name, ref: pinnacleSport.sport.ref}
        };

        PinLeagueBl.create(pinnacleLeague, callback);
    }

    todo.push(createLeague);
    todo.push(createPinnacleLeague);

    async.waterfall(todo, callback);
}

function updateLeagues(pinnacleLeague, leagueApi, pinnacleSportsbook, callback){


    var active = parseInt(leagueApi.$.feedContents);

    function findLeague(callback){
        LeagueBl.getOneByQuery({_id: pinnacleLeague.league.ref}, callback);
    }

    function updateActive(league, callback){
        if(!pinnacleSportsbook._id.equals(league.primarySportsbook)) return callback(null);

        function cb(err, league){
            callback(err);
        }

        if (active === 1 && pinnacleLeague.active === false){
            pinnacleLeague.active = true;
            LeagueBl.update({active:true}, league, cb);
        } else if (active === 0 && pinnacleLeague.active === true) {
            pinnacleLeague.active = false;
            LeagueBl.update({active:true}, league, cb);
        }
    }

    function savePinnacleLeague(league, callback){
        pinnacleLeague.save(callback);
    }

    var todo = [];

    todo.push(findLeague);
    todo.push(updateActive);
    todo.push(savePinnacleLeague);

    async.waterfall(todo, callback);

}

function processLeague(leagueApi, pinnacleSport, pinnacleSportsbook, callback){

    var todo = [];

    function checkExcludedLeagueType(callback){
        var excludeLeague = false;
        var name = leagueApi._;

        for(var i=0; i<excludeLeagueTypes.length; i++){
            if(name.indexOf(excludeLeagueTypes[i]) !== -1){
                excludeLeague = true;
                break;
            }
        }
        if(excludeLeague) return callback('league excluded');
        callback(null);
    }

    function findPinnacleLeague(callback){
        var id = parseInt(leagueApi.$.id);
        PinLeagueBl.getOneByQuery({leagueId: id}, callback);
    }

    function createOrUpdateLeagues(pinnacleLeague, callback){
        if(!pinnacleLeague){
            createLeagues(leagueApi, pinnacleSport, pinnacleSportsbook, callback);
        } else {
            updateLeagues(pinnacleLeague, leagueApi, pinnacleSportsbook, callback);
        }
    }

    todo.push(checkExcludedLeagueType);
    todo.push(findPinnacleLeague);
    todo.push(createOrUpdateLeagues);

    function cb(err){
        if(err === 'league excluded') return callback(null);
        callback(err);
    }

    async.waterfall(todo, cb);
}

function updateInsertLeagues(pinnacleSport, callback){
    var todo = [];

    function getPinnacleSportsbook(callback){
        SportsbookBl.getPinnacle(callback);
    }

    function getLeaguesFeed(pinnacleSportsbook, callback){
        function cb(err, results){
            callback(err, results, pinnacleSportsbook);
        }
        PinApiBl.getLeagues(pinnacleSport.sportId, cb);
    }

    function processLeaguesApiFeed(results, pinnacleSportsbook, callback){
        if(!results) return callback(null);
        var leagues = results.rsp.leagues[0];
        if(!leagues) return callback(null);

        function processLeague_loop(leagueApi, callback){
            processLeague(leagueApi, pinnacleSport, pinnacleSportsbook, callback);
        }
        async.eachSeries(leagues.league, processLeague_loop, callback);

    }

    todo.push(getPinnacleSportsbook);
    todo.push(getLeaguesFeed);
    todo.push(processLeaguesApiFeed);

    async.waterfall(todo, callback);

}

function updateInsertAllLeagues(callback){
    var todo = [];

    function getPinnacleSports(callback){
        PinSportBl.getAll(callback);
    }

    function updateInsertLeagues_todo(pinnacleSports, callback) {
        async.eachSeries(pinnacleSports, updateInsertLeagues, callback);
    }


    todo.push(getPinnacleSports);
    todo.push(updateInsertLeagues_todo);

    async.waterfall(todo, callback);

}

exports.updateInsertAllLeagues = updateInsertAllLeagues;