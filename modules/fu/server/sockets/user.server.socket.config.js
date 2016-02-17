'use strict';

var mongoose = require('mongoose'),
    UserBl = require('../bl/user.server.bl');

var nsp;

module.exports = function (io) {

    nsp = io.of('/user');

    nsp.on('connection', function(socket) {

        socket.on('user join', function(userId){
            socket.join(userId);

            function cb(err, notifications){
                nsp.to(userId).emit('new notification', notifications);
            }

            UserBl.getNotifications(userId, cb);
        });

        socket.on('disconnect', function(){
        });
    });

};


exports.sendNotification = function(notification){
    nsp.to(notification.user.ref).emit('new notification', notification);
};



