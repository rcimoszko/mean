'use strict';

var mongoose = require('mongoose'),
    path = require('path'),
    _ = require('lodash'),
    PickBl = require('./pick.server.bl'),
    async = require('async');


function getAll(callback){
    var todo = [];

    function getTable(callback){
        var aggArray = [];

        var match = {$match: {premium:true, result:{$ne:'Pending'}}};
        var project = {$project: {
            year:  { $year:  '$eventStartTime'},
            month: { $month: '$eventStartTime'},
            profit: 1,
            units:  1
        }};
        var group = {$group:{
            _id:    {year: '$year', month: '$month'},
            profit: {$sum:'$profit'},
            wins:   {$sum: {$cond: [{$gt:['$profit', 0]}, 1, 0]}},
            losses: {$sum: {$cond: [{$lt:['$profit', 0]}, 1, 0]}},
            units:  {$sum:'$units'},
            count:  {$sum:1}
        }};

        var project2 =  {$project:{date:'$_id', profit:1, wins:1, losses:1, count:1, roi: { $multiply:[{$divide: [ '$profit', '$units' ]}, 100]}}};

        aggArray.push(match);
        aggArray.push(project);
        aggArray.push(group);
        aggArray.push(project2);

        PickBl.aggregate(aggArray, callback);
    }

    function processTable(proPicksTable, callback){
        for(var i=0; i<proPicksTable.length; i++){
            proPicksTable[i].date = new Date(proPicksTable[i].date.year, proPicksTable[i].date.month);
        }
        callback(null, proPicksTable);
    }

    todo.push(getTable);
    todo.push(processTable);

    async.waterfall(todo, callback);
}

function getByLeague(callback){
    var todo = [];

    function getTable(callback) {

        var aggArray = [];

        var match = {$match: {premium: true, result: {$ne:'Pending'}}};
        var project = {$project: {
            year: { $year: '$eventStartTime'},
            month: { $month: '$eventStartTime'},
            sport: 1,
            league: 1,
            profit: 1,
            units: 1
        }};
        var group = {$group: {
            _id:    {year: '$year', month: '$month', league: '$league'},
            profit: {$sum: '$profit'},
            wins:   {$sum: {$cond: [ {$gt: ['$profit', 0]}, 1, 0]}},
            losses: {$sum: {$cond: [ {$lt: ['$profit', 0]}, 1, 0]}},
            units:  {$sum: '$units'},
            count:  {$sum: 1}
        }};

        var project2 = {$project: {group: '$_id', profit: 1, wins: 1, losses: 1, count: 1, roi: { $multiply: [{$divide: [ '$profit', '$units' ]},100]}}};

        aggArray.push(match);
        aggArray.push(project);
        aggArray.push(group);
        aggArray.push(project2);

        PickBl.aggregate(aggArray, callback);
    }


    function populateTable(proPicksTable, callback){
        var populate = {path:'group.league', select:'name', model:'League'};
        PickBl.populateBy(proPicksTable, populate, callback);

    }

    function processTable(proPicksTable, callback){
        for(var i=0; i<proPicksTable.length; i++){
            proPicksTable[i].date = new Date(proPicksTable[i].group.year, proPicksTable[i].group.month, 0);
            proPicksTable[i].league = proPicksTable[i].group.league.name;
            delete proPicksTable[i].group;
            delete proPicksTable[i]._id;
        }
        callback(null, proPicksTable);
    }

    function groupTable(proPicksTable, callback){
        proPicksTable = _.groupBy(proPicksTable, 'league');
        callback(null, proPicksTable);
    }

    todo.push(getTable);
    todo.push(populateTable);
    todo.push(processTable);
    todo.push(groupTable);

    async.waterfall(todo, callback);
}

function getBySport(callback){
    var todo = [];

    function getTable(callback) {

        var aggArray = [];

        var match = {$match: {premium: true, result: {$ne:'Pending'}}};
        var project = {$project: {
            year: { $year: '$eventStartTime'},
            month: { $month: '$eventStartTime'},
            sport: 1,
            profit: 1,
            units: 1
        }};
        var group = {$group: {
            _id:    {year: '$year', month: '$month', sport: '$sport'},
            profit: {$sum: '$profit'},
            wins:   {$sum: {$cond: [ {$gt: ['$profit', 0]}, 1, 0]}},
            losses: {$sum: {$cond: [ {$lt: ['$profit', 0]}, 1, 0]}},
            units:  {$sum: '$units'},
            count:  {$sum: 1}
        }};

        var project2 = {$project: {group: '$_id', profit: 1, wins: 1, losses: 1, count: 1, roi: { $multiply: [{$divide: [ '$profit', '$units' ]},100]}}};

        aggArray.push(match);
        aggArray.push(project);
        aggArray.push(group);
        aggArray.push(project2);

        PickBl.aggregate(aggArray, callback);
    }


    function populateTable(proPicksTable, callback){
        var populate = {path:'group.sport', select:'name', model:'Sport'};
        PickBl.populateBy(proPicksTable, populate, callback);

    }

    function processTable(proPicksTable, callback){
        for(var i=0; i<proPicksTable.length; i++){
            proPicksTable[i].date = new Date(proPicksTable[i].group.year, proPicksTable[i].group.month, 0);
            proPicksTable[i].sport = proPicksTable[i].group.sport.name;
            delete proPicksTable[i].group;
            delete proPicksTable[i]._id;
        }
        callback(null, proPicksTable);
    }

    function groupTable(proPicksTable, callback){
        proPicksTable = _.groupBy(proPicksTable, 'sport');
        callback(null, proPicksTable);
    }

    todo.push(getTable);
    todo.push(populateTable);
    todo.push(processTable);
    todo.push(groupTable);

    async.waterfall(todo, callback);
}

function getTotalsByLeague(callback){
    var todo = [];

    function getTable(callback) {

        var aggArray = [];

        var match = {$match: {premium: true, result: {$ne:'Pending'}}};
        var group = {$group: {
            _id:    '$league',
            profit: {$sum: '$profit'},
            wins:   {$sum: {$cond: [ {$gt: ['$profit', 0]}, 1, 0]}},
            losses: {$sum: {$cond: [ {$lt: ['$profit', 0]}, 1, 0]}},
            units:  {$sum: '$units'},
            count:  {$sum: 1}
        }};

        var project = {$project: {league: '$_id', profit: 1, wins: 1, losses: 1, count: 1, roi: { $multiply: [{$divide: [ '$profit', '$units' ]},100]}}};

        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(project);

        PickBl.aggregate(aggArray, callback);
    }


    function populateTable(proPicksTable, callback){
        var populate = {path:'league', select:'name', model:'League'};
        PickBl.populateBy(proPicksTable, populate, callback);

    }

    function processTable(proPicksTable, callback){
        for(var i=0; i<proPicksTable.length; i++){
            proPicksTable[i].league = proPicksTable[i].league.name;
            delete proPicksTable[i]._id;
        }
        callback(null, proPicksTable);
    }


    todo.push(getTable);
    todo.push(populateTable);
    todo.push(processTable);

    async.waterfall(todo, callback);
}

function getTotalsBySport(callback){
    var todo = [];

    function getTable(callback) {

        var aggArray = [];

        var match = {$match: {premium: true, result: {$ne:'Pending'}}};
        var group = {$group: {
            _id:    '$sport',
            profit: {$sum: '$profit'},
            wins:   {$sum: {$cond: [ {$gt: ['$profit', 0]}, 1, 0]}},
            losses: {$sum: {$cond: [ {$lt: ['$profit', 0]}, 1, 0]}},
            units:  {$sum: '$units'},
            count:  {$sum: 1}
        }};

        var project = {$project: {sport: '$_id', profit: 1, wins: 1, losses: 1, count: 1, roi: { $multiply: [{$divide: [ '$profit', '$units' ]},100]}}};

        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(project);

        PickBl.aggregate(aggArray, callback);
    }


    function populateTable(proPicksTable, callback){
        var populate = {path:'sport', select:'name', model:'Sport'};
        PickBl.populateBy(proPicksTable, populate, callback);

    }

    function processTable(proPicksTable, callback){
        for(var i=0; i<proPicksTable.length; i++){
            proPicksTable[i].sport = proPicksTable[i].sport.name;
            delete proPicksTable[i]._id;
        }
        callback(null, proPicksTable);
    }


    todo.push(getTable);
    todo.push(populateTable);
    todo.push(processTable);

    async.waterfall(todo, callback);
}

exports.getAll      = getAll;
exports.getByLeague = getByLeague;
exports.getBySport  = getBySport;

exports.getTotalsByLeague = getTotalsByLeague;
exports.getTotalsBySport  = getTotalsBySport;