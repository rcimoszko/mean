'use strict';

var async = require('async'),
    _ = require('lodash'),
    UserBl = require('./user.server.bl'),
    CommentBl = require('./comment.server.bl'),
    //ChatBl = require('./chat.server.bl'),
    PickBl = require('./pick.server.bl');



function getGeneral(query, callback){

    //var dateType = query.dateType;
    var dateType = query.dateType;
    var project = {};

    switch(dateType){
        case 'daily':
        case 'weekly':
            project = {$project: {
                day: { $dayOfMonth: '$created'},
                year: { $year: '$created'},
                month: { $month: '$created'}
            }};
            break;
        case 'monthly':
            project = {$project: {
                year: { $year: '$created'},
                month: { $month: '$created'}
            }};
            break;
    }

    function getNewUserCount(callback){

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            userCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        UserBl.aggregate(aggArray, callback);
    }

    function getPickCount(callback){

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            pickCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        PickBl.aggregate(aggArray, callback);
    }

    function getCommentCount(callback){

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            commentCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        CommentBl.aggregate(aggArray, callback);

    }

    var todo = {
        newUsers: getNewUserCount,
        picks: getPickCount,
        comments: getCommentCount
    };

    function done(err, results){
        var metrics = [];

        var currentDate = new Date();
        var endDate = new Date(2014, 11, 1);

        function filterDay(metric){
            return metric._id.year === currentDate.getFullYear() && metric._id.month === currentDate.getMonth() + 1 && metric._id.day === currentDate.getDate();
        }

        while(currentDate > endDate){
            var pickCount = _.find(results.picks, filterDay);
            var userCount = _.find(results.newUsers, filterDay);
            var commentCount = _.find(results.comments, filterDay);
            var date = new Date(currentDate);
            var metric = {date: date};
            if(pickCount) metric.pickCount = pickCount.pickCount;
            if(userCount) metric.userCount = userCount.userCount;
            if(commentCount) metric.commentCount = commentCount.commentCount;
            metrics.push(metric);
            currentDate.setDate(currentDate.getDate() - 1);
        }
        callback(err, metrics);
    }

    async.parallel(todo, done);

}

exports.getGeneral = getGeneral;