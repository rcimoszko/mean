'use strict';

var mongoose = require('mongoose'),
    https = require('https'),
    parseString = require('xml2js').parseString;


function getSports(callback){
    return getRequest('/v1/sports', callback);
}

function getLeagues(sportId, callback){
    return getRequest('/v1/leagues?sportid='+sportId, callback);
}

function getEvents(sportId, leagueId, last, callback){
    var path = '/v1/fixtures?sportId='+sportId+'&leagueIds='+leagueId+'&oddsformat=1&islive=0';
    if(last){
        path = path+'&last='+last;
    }
    return getRequest(path, callback);
}

function getOdds(sportId, leagueId, last, callback){
    var path = '/v1/odds?sportId='+sportId+'&leagueIds='+leagueId+'&oddsformat=1&islive=0';
    if(last){
        path = path+'&last='+last;
    }
    return getRequest(path, callback);
}

function getScores(sportId, leagueId, last, callback){
    var path = '/v1/fixtures/settled?sportId='+sportId+'&leagueIds='+leagueId+'&oddsformat=1&islive=0';
    if(last){
        path = path+'&last='+last;
    }
    return getRequest(path, callback);
}

function getRequest(path, callback){

    var options = {
        hostname: 'api.pinnaclesports.com',
        path: path,
        method: 'GET',
        headers: {
            'Accept': 'application/xml'
        },
        auth: 'RC438088:rcimos86!'
    };

    var req = https.request(options, function(res) {

        var data = '';

        res.on('data', function(d) {
            data = data + d;
        });

        res.on('end', function(){
            parseString(data, function (err, result) {
                callback(null, result);
            });
        });

    });

    req.end();

    req.on('error', function(err) {
        console.error(err);
        callback(err, null);
    });

}

exports.getSports   = getSports;
exports.getLeagues  = getLeagues;
exports.getEvents   = getEvents;
exports.getOdds     = getOdds;
exports.getScores   = getScores;