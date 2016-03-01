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


function get(id, callback){

    function cb(err, sport){
        callback(err, sport);
    }

    m_Notification.findById(id).exec(cb);
}

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

    function populateNotification(notification, callback){
        m_Notification.populate(notification, {path: 'userFrom.ref', model:'User', select:'username avatarUrl'}, callback);
    }

    function sendNotification(notification, callback){
        UserSocket.sendNotification(notification);
        callback();
    }

    todo.push(createNotification);
    todo.push(populateNotification);
    todo.push(sendNotification);

    async.waterfall(todo, callback);
}

function createCopyPickNotification(user, userFrom, pick, callback){
    var todo = [];

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
            pick: pick._id
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

        create(notification, callback);
    }

    function populateNotification(notification, callback){
        m_Notification(notification, populate, callback);
    }

    function sendNotification(notification, callback){
        UserSocket.sendNotification(notification);
        callback();
    }

    todo.push(createNotification);
    todo.push(populateNotification);
    todo.push(sendNotification);

    async.waterfall(todo, callback);
}

function read(user, notification, callback){
    var todo = [];

    function checkPermission(callback){
        if(String(user._id) !== String(notification.user.ref)) return callback('no permission');
        callback();
    }

    function updateNotification(callback){
        function cb(err){
            callback(err);
        }

        notification.new = false;
        notification.save(cb);

    }
    function populateNotification(callback){
       m_Notification.populate(notification, populate, callback);
    }

    todo.push(checkPermission);
    todo.push(updateNotification);
    todo.push(populateNotification);

    async.waterfall(todo, callback);
}

exports.get = get;
exports.getByUser = getByUser;
exports.getByQuery = getByQuery;

exports.createFollowNotification        = createFollowNotification;
exports.createCopyPickNotification      = createCopyPickNotification;
exports.createCommentPickNotification   = createCommentPickNotification;
exports.createCommentReplyNotification   = createCommentReplyNotification;

exports.read   = read;

