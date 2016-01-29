'use strict';

var mongoose = require('mongoose'),
    https = require('https'),
    parseString = require('xml2js').parseString;


function getSports(callback){
    return getRequest('/v1/sports', 'xml', callback);
}

function getLeagues(sportId, callback){
    return getRequest('/v1/leagues?sportid='+sportId, 'xml', callback);
}

function getEvents(sportId, leagueId, last, callback){
    var path = '/v1/fixtures?sportId='+sportId+'&leagueIds='+leagueId+'&oddsformat=1&islive=0';
    if(last){
        path = path+'&last='+last;
    }
    return getRequest(path, 'json', callback);
}

function getOdds(sportId, leagueId, last, callback){
    var path = '/v1/odds?sportId='+sportId+'&leagueIds='+leagueId+'&oddsformat=1&islive=0';
    if(last){
        path = path+'&last='+last;
    }
    return getRequest(path, 'json', callback);
}

function getScores(sportId, leagueId, last, callback){
    var path = '/v1/fixtures/settled?sportId='+sportId+'&leagueIds='+leagueId+'&oddsformat=1&islive=0';
    if(last){
        path = path+'&last='+last;
    }
    return getRequest(path, 'json', callback);
}

function getRequest(path, responseType, callback){

    var options = {
        hostname: 'api.pinnaclesports.com',
        path: path,
        method: 'GET',
        headers: {
            'Accept': 'application/'+responseType
        },
        auth: 'RC438088:rcimos86!'
    };

    var req = https.request(options, function(res) {

        var data = '';

        res.on('data', function(d) {
            data = data + d;
        });

        res.on('end', function(){
            switch(responseType){
                case 'json':
                    console.log(data);
                    if(!data) return callback(null, null);
                    callback(null, JSON.parse(data));
                    break;
                case 'xml':
                    parseString(data, function (err, result) {
                        callback(err, result);
                    });
                    break;
            }
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