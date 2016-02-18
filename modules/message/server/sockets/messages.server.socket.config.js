'use strict';

var mongoose = require('mongoose');

module.exports = function (io) {

    var nsp = io.of('/messages');

    nsp.on('connection', function(socket) {

        socket.on('join room', function(conversationId){

        });

        socket.on('new conversation', function(newConversation){

        });

        socket.on('message reply', function(reply){

        });

        socket.on('add recipients', function(newRecipient){
        });

        socket.on('leave conversation', function(leaveConversation){
        });

        socket.on('leave room', function(conversationId){
        });

        socket.on('new message', function(chat){
        });

        socket.on('disconnect', function(){

        });
    });
};



