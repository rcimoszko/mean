'use strict';

var mongoose = require('mongoose'),
    PinnacleSport = mongoose.model('PinnacleSport'),
    PinApiBl = require('./pinnacle.api.server.bl'),
    PinnacleSportBl = require('./pinnacleSport.server.bl'),
    SportBl = require('../../../fu/server/bl/sport.server.bl'),
    async = require('async');


var excludedSports = [
    'Alpine Skiing',
    'Badminton',
    'Bandy',
    'Curling',
    'Darts',
    'Darts (Legs)',
    'Floorball',
    'Other Sports',
    'Politics',
    'Softball',
    'Squash',
    'Snooker',
    'Volleyball (Points)',
    'Water Polo',
    'Biathlon',
    'Ski Jumping',
    'Cross Country',
    'Formula 1',
    'Bobsleigh',
    'Figure Skating',
    'Freestyle Skiing',
    'Luge',
    'Nordic Combined',
    'Short Track',
    'Skeleton',
    'Snow Boarding',
    'Speed Skating',
    'Table Tennis',
    'Futsal'
];

function updateInsertSports(callback){

    var todo = [];

    function getSports(callback){
        PinApiBl.getSports(callback);
    }

    function updateSports(result, callback){
        if(!result) return callback(null);
        var sports = result.rsp.sports[0].sport;

        function updateInsertSport(sport, callback){
            var todo = [];

            var name = sport._,
                active = parseInt(sport.$.feedContents),
                id = parseInt(sport.$.id);


            if(excludedSports.indexOf(name) !== -1) return callback();

            function findPinnacleSport(callback){
                PinnacleSport.findOne({ name: name, sportId: id}, callback);
            }

            function createSport(pinnacleSport, callback){
                if(pinnacleSport) return callback(null, null);

                var sport = {
                    name: name,
                    active: active
                };

                SportBl.create(sport, callback)
            }

            function createPinnacleSport(sport, callback){
                if(!sport) return callback(null);

                var pinnacleSport = {
                    name: name,
                    sportId: id,
                    sport:{name:sport.name, ref:sport}
                };

                PinnacleSportBl.create(pinnacleSport, callback)
            }

            todo.push(findPinnacleSport);
            todo.push(createSport);
            todo.push(createPinnacleSport);

            async.waterfall(todo, callback);
        }


        async.each(sports, updateInsertSport, callback);

    }

    todo.push(getSports);
    todo.push(updateSports);

    async.waterfall(todo, callback);

}

exports.updateInsertSports = updateInsertSports;