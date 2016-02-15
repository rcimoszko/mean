'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    PickBl = require('./pick.server.bl'),
    EventBl = require('./event.server.bl'),
    PickListBl = require('./pick.list.server.bl'),
    DateQueryBl = require('./date.query.server.bl'),
    User = mongoose.model('User');

function getUserStats(user, dateId, callback){

    var stats = {
        avgOdds: 0,
        avgBet: 0,
        roi: 0,
        profit: 0,
        wins: 0,
        losses: 0
    };

    if (user.winStreak > 0) {
        stats.streak = user.winStreak + 'W';
    } else if (user.loseStreak > 0) {
        stats.streak = user.loseStreak + 'L';
    }

    var aggArray = [];
    var match =  {$match:{
        'user.ref': user._id,
        'result': {$ne: 'Pending'},
        'eventStartTime': DateQueryBl.getDateQuery(dateId)
    }};

    var group =  {$group:{
        _id: '$user.ref',
        avgOdds: { $avg: '$odds' },
        avgBet: { $avg: '$units' },
        units: {$sum: '$units'},
        profit: {$sum: '$profit'},
        wins: {$sum: {$cond: [{$gt:['$profit', 0]}, 1, 0]}},
        losses: {$sum: {$cond: [{$lt:['$profit', 0]}, 1, 0]}}
    }};
    var project = {$project:{_id:1, avgOdds:1, avgBet:1, units:1, profit:1, wins:1, losses:1, roi: { $multiply:[{$divide: [ '$profit', '$units' ]}, 100]}}};

    aggArray.push(match);
    aggArray.push(group);
    aggArray.push(project);

    function cb(err, calcStats){
        if(calcStats.length){
            stats = _.extend(stats, calcStats[0]);
        }
        callback(err, stats);
    }

    PickBl.aggregate(aggArray, cb);
}

function getProfitChart(user, dateId, callback) {

    var profitChart = {};

    function getCompletedPicks(callback){

        function cb(err, picks){
            callback(err, picks);
        }
        var aggArray = [];
        var match =  { $match: {'user.ref':user._id, result:{$ne:'Pending'}, eventStartTime:DateQueryBl.getDateQuery(dateId)}};
        var group =  { $group: { _id: '$eventStartTime', profit: { $sum: '$profit' }} };
        var sort =   { $sort: { _id:1 } };

        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(sort);
        PickBl.aggregate(aggArray, cb);
    }

    function createChart(picks, callback){
        profitChart = {cols: [
            {id: 'date', label:'Date', type:'date', p:{}},
            {id:'profit', label:'Profit', type:'number', p:{}}],
            rows:[]};

        function cb(err){
            callback(err);
        }

        var totalProfit = 0;

        function calculate(pick, callback){
            totalProfit = totalProfit + pick.profit;
            profitChart.rows.push({c:[{v:pick._id}, {v:totalProfit}]});
            callback();
        }

        async.eachSeries(picks, calculate, cb);
    }

    function cb(err){
        callback(err, profitChart);
    }

    var profileChartToDo = [];
    profileChartToDo.push(getCompletedPicks);
    profileChartToDo.push(createChart);
    async.waterfall(profileChartToDo, cb);
}

function getPerformance(categoryField, categoryModel, user, callback){
    var todo = [];
    var match = {$match: {'user.ref': mongoose.Types.ObjectId(user._id)}};
    var group = {$group: {
        _id:   categoryField,
        profit: {$sum: '$profit'},
        units:  {$sum: '$units'},
        wins:   {$sum: {$cond: [{$gt:['$profit', 0]}, 1, 0]}},
        losses: {$sum: {$cond: [{$lt:['$profit', 0]}, 1, 0]}}
    }};
    var project =  {$project:{_id:1, profit:1, wins:1, losses:1, roi: { $multiply:[{$divide: [ '$profit', '$units' ]}, 100]}}};
    var sort = {$sort:{profit:-1}};


    function getTable(callback){
        var aggArray = [];
        aggArray.push(match);
        aggArray.push(group);
        aggArray.push(project);
        aggArray.push(sort);
        PickBl.aggregate(aggArray, callback);
    }

    function populate(performance, callback){
        var pop = {path: '_id', model:categoryModel, select: 'name'};
        PickBl.populateBy(performance, pop, callback);
    }

    todo.push(getTable);
    todo.push(populate);

    async.waterfall(todo, callback);
}

function getTopPerformances(user, callback){
    var todo = [];
    var topPerformances = [];


    function getSportProfit(callback){
        function cb(err, sportPerformances){
            topPerformances = topPerformances.concat(sportPerformances);
            callback(err);
        }
        getPerformance('$sport', 'Sport', user, cb);
    }

    function getLeagueProfit(callback){

        function cb(err, leaguePerformances){
            topPerformances = topPerformances.concat(leaguePerformances);
            callback(err);
        }
        getPerformance('$league', 'League', user, cb);
    }


    function cb(err){
        topPerformances = _.sortBy(topPerformances, function(category){
            return -1*category.profit;
        });
        topPerformances = topPerformances.slice(0, 5);
        callback(err, topPerformances);
    }

    todo.push(getSportProfit);
    todo.push(getLeagueProfit);

    async.parallel(todo, cb);

}

function get(user, callback){
    var todo = [];
    var profile = {};

    function setUser_todo(callback){
        profile.user = {
            _id: user._id,
            username: user.username,
            followingCount: user.followingCount,
            followerCount: user.followerCount,
            profileUrl: user.profileUrl
        };
        callback();
    }

    function getAllTimeUserStats_todo(callback){
        function cb(err, stats){
            profile.allTimeStats = stats;
            callback(err);
        }
        getUserStats(user, 'allTime', cb);
    }

    function getlast30UserStats_todo(callback){
        function cb(err, stats){
            profile.last30Stats = stats;
            callback(err);
        }
        getUserStats(user, 'last30Days', cb);
    }

    function getProfitChart_todo(callback){

        function cb(err, profitChart){
            profile.last30ProfitChart = profitChart;
            callback(err);
        }
        getProfitChart(user, 'last30Days', cb);

    }

    function getTopPerformances_todo(callback){

        function cb(err, topPerformances){
            profile.topPerformances = topPerformances;
            callback(err);
        }
        getTopPerformances(user, cb);
    }

    function getProfilePicks_todo(callback){
        function cb(err, pendingPicks){
            profile.pendingPicks = pendingPicks;
            callback(err);
        }
        PickListBl.getEventPickList('all', 'all', user._id, false, 0, 100, 100, 'pending', user.premium, cb);
    }

    function getTrackerPicks_todo(callback){
        var todo = [];

        function getPicks(callback){
            PickBl.getByQuery({'user.ref': user._id}, callback);
        }

        function populatePicks(picks, callback){
            var populate = [{path:'contestant.ref', model: 'Contestant'}];
            PickBl.populateBy(picks, populate, callback);
        }

        function populateEvents(picks, callback){
            var populate = [{path:'event.league.ref', model: 'League'}];
            EventBl.populateBy(picks, populate, callback);
        }

        todo.push(getPicks);
        todo.push(populatePicks);
        todo.push(populateEvents);

        function cb(err, picks){
            profile.trackerPicks = picks;
            callback(err);
        }

        async.waterfall(todo, cb);



    }

    function cb(err){
        callback(err, profile);
    }

    todo.push(setUser_todo);
    todo.push(getAllTimeUserStats_todo);
    todo.push(getlast30UserStats_todo);
    todo.push(getProfitChart_todo);
    todo.push(getTopPerformances_todo);
    todo.push(getProfilePicks_todo);
    todo.push(getTrackerPicks_todo);

    async.parallel(todo, cb);

}

exports.get = get;
