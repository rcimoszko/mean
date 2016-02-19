'use strict';

var _ = require('lodash'),
    mongoose = require('mongoose'),
    async = require('async'),
    UserSocket = require('../sockets/user.server.socket.config'),
    m_Notification = mongoose.model('Notification');

var populate = [
        {path:'userFrom.ref', model:'User', select: 'username avatarUrl'},
        {path:'comment', model:'Comment'},
        {path:'pick', model: 'Pick'}
    ];

function create(data, callback) {

    function cb(err){
        callback(err, notification);
    }

    var notification = new m_Notification(data);

    notification.save(cb);
}

function getByQuery(query, callback){
    m_Notification.find(query).sort('-timestamp').limit(10).populate(populate).exec(callback);
}


function getByUser(userId, callback){
    var query = {'user.ref':userId};
    getByQuery(query, callback);
}

function createFollowNotification(user, userFrom, follow, callback){
    var todo = [];

    function createNotification(callback){
        var notification = {
            user: {name: user.username, ref: user._id},
            userFrom: {name: userFrom.username, ref: userFrom._id},
            type: 'follow',
            follow:follow
        };

        create(notification, callback);
    }

    function sendNotification(notification, callback){

        UserSocket.sendNotification(notification);
        callback();
    }

    todo.push(createNotification);
    todo.push(sendNotification);

    async.waterfall(todo, callback);
}

function createCopyPickNotification(user, userFrom, pick, callback){
    var todo = [];

    console.log(user);
    console.log(userFrom);
    console.log(pick);

    function createNotification(callback){
        var notification = {
            user: {name: user.name, ref: user.ref},
            userFrom: {name: userFrom.username, ref: userFrom._id},
            type: 'copy pick',
            pick: pick
        };

        create(notification, callback);
    }

    function sendNotification(notification, callback){
        UserSocket.sendNotification(notification);
        callback();
    }

    todo.push(createNotification);
    todo.push(sendNotification);

    async.waterfall(todo, callback);
}

function createCommentPickNotification(user, userFrom, pick, comment, callback){

    var todo = [];

    function createNotification(callback){
        var notification = {
            user: {name: user.name, ref: user.ref},
            userFrom: {name: userFrom.username, ref: userFrom._id},
            type: 'pick comment',
            comment: comment,
            pick: pick
        };

        create(notification, callback);
    }

    function sendNotification(notification, callback){
        UserSocket.sendNotification(notification);
        callback();
    }

    todo.push(createNotification);
    todo.push(sendNotification);

    async.waterfall(todo, callback);
}

function createCommentReplyNotification(user, userFrom, comment, callback){
    var todo = [];

    function createNotification(callback){
        var notification = {
            user: {name: user.username, ref: user._id},
            userFrom: {name: userFrom.username, ref: userFrom._id},
            type: 'comment reply',
            comment: comment
        };
        console.log(notification);

        create(notification, callback);
    }

    function sendNotification(notification, callback){
        UserSocket.sendNotification(notification);
        callback();
    }

    todo.push(createNotification);
    todo.push(sendNotification);

    async.waterfall(todo, callback);
}

exports.getByUser = getByUser;
exports.getByQuery = getByQuery;

exports.createFollowNotification        = createFollowNotification;
exports.createCopyPickNotification      = createCopyPickNotification;
exports.createCommentPickNotification   = createCommentPickNotification;
exports.createCommentReplyNotification   = createCommentReplyNotification;

