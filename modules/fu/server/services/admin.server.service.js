'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    SportBl = require('../bl/sport.server.bl'),
    LeagueBl = require('../bl/league.server.bl'),
    slug = require('speakingurl');

function assignSlugs(callback){
    var todo = [];

    function getSports(callback){
        SportBl.getAll(callback);
    }

    function processSports(sports, callback){

        function processSport(sport, callback){

            var todo = [];

            function saveSport(callback){
                sport.slug = slug(sport.name);
                sport.save(callback);
            }

            function getLeagues(sport, num, callback){
                LeagueBl.getBySport(sport, callback);
            }

            function processLeagues(leagues, callback){

                function processLeague(league, callback){
                    league.slug = slug(league.name);
                    console.log(league.name);
                    league.save(callback);
                }
                async.eachSeries(leagues, processLeague, callback);

            }

            todo.push(saveSport);
            todo.push(getLeagues);
            todo.push(processLeagues);


            async.waterfall(todo, callback);
        }

        async.eachSeries(sports, processSport, callback);

    }

    todo.push(getSports);
    todo.push(processSports);

    async.waterfall(todo, callback);
}

exports.assignSlugs = assignSlugs;