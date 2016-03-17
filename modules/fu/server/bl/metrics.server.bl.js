'use strict';

var async = require('async'),
    _ = require('lodash'),
    UserBl = require('./user.server.bl'),
    CommentBl = require('./comment.server.bl'),
    //ChatBl = require('./chat.server.bl'),
    PickBl = require('./pick.server.bl');



function getGeneral(query, callback){

    //var dateType = query.dateType;

    function getNewUserCount(callback){
        var project = {$project: {
            day: { $dayOfMonth: '$created'},
            year: { $year: '$created'},
            month: { $month: '$created'}
        }};
        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            userCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        UserBl.aggregate(aggArray, callback);
    }

    function getPickCount(callback){

        var project = {$project: {
            day: { $dayOfMonth: '$timeSubmitted'},
            year: { $year: '$timeSubmitted'},
            month: { $month: '$timeSubmitted'}
        }};
        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            pickCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        PickBl.aggregate(aggArray, callback);
    }

    function getCommentCount(callback){

        var project = {$project: {
            day: { $dayOfMonth: '$timestamp'},
            year: { $year: '$timestamp'},
            month: { $month: '$timestamp'}
        }};
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
        var merged = _.merge(results.comments, results.picks);
        merged = _.merge(merged, results.newUsers);
        callback(null, merged);
    }

    async.parallel(todo, done);

}

exports.getGeneral = getGeneral;