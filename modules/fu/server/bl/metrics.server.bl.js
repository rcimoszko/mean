'use strict';

var async = require('async'),
    _ = require('lodash'),
    UserBl = require('./user.server.bl'),
    CommentBl = require('./comment.server.bl'),
    FollowBl = require('./follow.server.bl'),
    ChatBl = require('./chat.server.bl'),
    PickBl = require('./pick.server.bl');



function getGeneral(query, callback){

    var dateType = query.dateType;

    function getNewUserCount(callback){

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

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            userCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        UserBl.aggregate(aggArray, callback);
    }

    function getPickCount(callback){
        var project = {};
        switch(dateType){
            case 'daily':
            case 'weekly':
                project = {$project: {
                    day: { $dayOfMonth: '$timeSubmitted'},
                    year: { $year: '$timeSubmitted'},
                    month: { $month: '$timeSubmitted'}
                }};
                break;
            case 'monthly':
                project = {$project: {
                    year: { $year: '$timeSubmitted'},
                    month: { $month: '$timeSubmitted'}
                }};
                break;
        }

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            pickCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        PickBl.aggregate(aggArray, callback);
    }

    function getCommentCount(callback){
        var project = {};
        switch(dateType){
            case 'daily':
            case 'weekly':
                project = {$project: {
                    day: { $dayOfMonth: '$timestamp'},
                    year: { $year: '$timestamp'},
                    month: { $month: '$timestamp'}
                }};
                break;
            case 'monthly':
                project = {$project: {
                    year: { $year: '$timestamp'},
                    month: { $month: '$timestamp'}
                }};
                break;
        }

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            commentCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        CommentBl.aggregate(aggArray, callback);

    }

    function getFollowCount(callback){
        var project = {};
        switch(dateType){
            case 'daily':
            case 'weekly':
                project = {$project: {
                    day: { $dayOfMonth: '$startDate'},
                    year: { $year: '$startDate'},
                    month: { $month: '$startDate'}
                }};
                break;
            case 'monthly':
                project = {$project: {
                    year: { $year: '$startDate'},
                    month: { $month: '$startDate'}
                }};
                break;
        }

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            followCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        FollowBl.aggregate(aggArray, callback);
    }

    function getChatCount(callback){
        var project = {};
        switch(dateType){
            case 'daily':
            case 'weekly':
                project = {$project: {
                    day: { $dayOfMonth: '$timestamp'},
                    year: { $year: '$timestamp'},
                    month: { $month: '$timestamp'}
                }};
                break;
            case 'monthly':
                project = {$project: {
                    year: { $year: '$timestamp'},
                    month: { $month: '$timestamp'}
                }};
                break;
        }

        var group = {$group: {
            _id:    {year: '$year', month: '$month', day: '$day'},
            chatCount:  {$sum: 1}
        }};

        var aggArray = [project, group];

        ChatBl.aggregate(aggArray, callback);
    }

    var todo = {
        newUsers: getNewUserCount,
        picks: getPickCount,
        comments: getCommentCount,
        follows: getFollowCount,
        chats: getChatCount
    };

    function done(err, results){

        var metrics = [];

        function filterDay(metric){
            return metric._id.year === currentDate.getFullYear() && metric._id.month === currentDate.getMonth() + 1 && metric._id.day === currentDate.getDate();
        }
        function filterMonth(metric){
            return metric._id.year === currentMonth.getFullYear() && metric._id.month === currentMonth.getMonth() + 1;
        }

        var pickCount;
        var userCount;
        var commentCount;
        var followCount;
        var chatCount;
        var metric;
        var currentDate = new Date();
        var endDate = new Date(2013, 11, 1);

        switch (dateType){
            case 'daily':
                while(currentDate > endDate){
                    pickCount = _.find(results.picks, filterDay);
                    userCount = _.find(results.newUsers, filterDay);
                    commentCount = _.find(results.comments, filterDay);
                    followCount = _.find(results.follows, filterDay);
                    chatCount = _.find(results.chats, filterDay);
                    var date = new Date(currentDate);
                    metric = {date: date};
                    if(pickCount)       metric.pickCount = pickCount.pickCount;
                    if(userCount)       metric.userCount = userCount.userCount;
                    if(commentCount)    metric.commentCount = commentCount.commentCount;
                    if(followCount)     metric.followCount = followCount.followCount;
                    if(chatCount)       metric.chatCount = chatCount.chatCount;
                    metrics.push(metric);
                    currentDate.setDate(currentDate.getDate() - 1);
                }
                break;
            case 'weekly':
                var currentWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay());

                metric = {date: new Date(currentWeek), pickCount:0, userCount:0, commentCount:0, followCount:0, chatCount:0};

                while(currentDate > endDate){
                    pickCount = _.find(results.picks, filterDay);
                    userCount = _.find(results.newUsers, filterDay);
                    commentCount = _.find(results.comments, filterDay);
                    followCount = _.find(results.follows, filterDay);
                    chatCount = _.find(results.chats, filterDay);
                    if(currentDate > currentWeek){
                        if(pickCount)       metric.pickCount = metric.pickCount + pickCount.pickCount;
                        if(userCount)       metric.userCount = metric.userCount + userCount.userCount;
                        if(commentCount)    metric.commentCount = metric.commentCount + commentCount.commentCount;
                        if(followCount)     metric.followCount = metric.followCount + followCount.followCount;
                        if(chatCount)       metric.chatCount = metric.chatCount + chatCount.chatCount;
                    } else {
                        metrics.push(metric);
                        currentWeek = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()-7);
                        metric = {date: new Date(currentWeek), pickCount:0, userCount:0, commentCount:0, followCount:0, chatCount: 0};
                    }
                    currentDate.setDate(currentDate.getDate() - 1);
                }
                break;
            case 'monthly':
                var currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                while(currentMonth > endDate){
                    pickCount = _.find(results.picks, filterMonth);
                    userCount = _.find(results.newUsers, filterMonth);
                    commentCount = _.find(results.comments, filterMonth);
                    followCount = _.find(results.follows, filterMonth);
                    chatCount = _.find(results.chats, filterMonth);
                    metric = {date: new Date(currentMonth)};
                    if(pickCount)       metric.pickCount = pickCount.pickCount;
                    if(userCount)       metric.userCount = userCount.userCount;
                    if(commentCount)    metric.commentCount = commentCount.commentCount;
                    if(followCount)     metric.followCount = followCount.followCount;
                    if(chatCount)       metric.chatCount = chatCount.chatCount;
                    metrics.push(metric);
                    currentMonth.setMonth(currentMonth.getMonth() - 1);
                }
                break;
        }

        callback(err, metrics);
    }

    async.parallel(todo, done);

}


function getEngagement(query, callback){

    var dateType = query.dateType;

    var todo = [];

    function getNewUsersCount(callback){

        var match = {$match:{created: {$gte: new Date(2016, 1, 1)}}};

        var project = {};

        switch(dateType){
            case 'daily':
            case 'weekly':
                project = {$project: {
                    day:   { $dayOfMonth: '$created'},
                    month: { $month: '$created'},
                    year:  { $year: '$created'},
                    user:  '$$ROOT'
                }};
                break;
            case 'monthly':
                project = {$project: {
                    year: { $year: '$created'},
                    month: { $month: '$created'}
                }};
                break;
        }

        var group = {$group: {
            _id:        {year: '$year', month: '$month', day: '$day'},
            users:      {$addToSet: '$user'},
            userCount:  {$sum: 1}
        }};


        var aggArray = [match, project, group];

        UserBl.aggregate(aggArray, callback);
    }

    function processDates(metrics, callback){
        metrics = _.sortBy(metrics, '_id');

        function processCategory(category, callback){
            category.date = new Date(category._id.year, category._id.month, category._id.day);
            callback();
        }

        function cb(err){
            callback(err, metrics);
        }

        async.eachSeries(metrics, processCategory, cb);
    }

    function getPickCount(metrics, callback){

        function processCategory(category, callback){

            category.pickMadeCount = 0;

            function getUserPicks(user, callback){
                var created = new Date(user.created);
                var query = {'user.ref':user._id,
                            timeSubmitted: {$gte: created,
                                            $lte:new Date(created.getFullYear(), created.getMonth(), created.getDate(), created.getHours() + 1)
                                            }
                            };
                function cb(err, picks){
                    if(picks.length){
                        category.pickMadeCount = category.pickMadeCount + 1;
                    }
                    callback(err);
                }
                PickBl.getByQuery(query, cb);
            }
            async.eachSeries(category.users, getUserPicks, callback);

        }

        function cb(err){
            callback(err, metrics);
        }

        async.eachSeries(metrics, processCategory, cb);
    }

    function getFollowCount(callback){

    }


    todo.push(getNewUsersCount);
    todo.push(processDates);
    todo.push(getPickCount);
    //todo.push(getFollowCount);

    async.waterfall(todo, callback);

}

exports.getGeneral = getGeneral;
exports.getEngagement = getEngagement;