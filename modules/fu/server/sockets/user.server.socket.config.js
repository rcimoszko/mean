'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    UserBl = require('../bl/user.server.bl');

var nsp;

function config(io){
    nsp = io.of('/user');

    nsp.on('connection', function(socket) {

        socket.on('user join', function(userId){
            socket.join(userId);
        });

        socket.on('disconnect', function(){
        });
    });
}

function sendNotification(notification){
    nsp.to(notification.user.ref).emit('new notification', notification);
}

function newMessage(recipients){
    _.each(recipients, function(recipient){
        nsp.to(recipient.ref).emit('new message');
    });
}

exports.config = config;
exports.sendNotification = sendNotification;
exports.newMessage = newMessage;

