'use strict';

var mongoose = require('mongoose'),
    ChatBl = require('../bl/chat.server.bl');

function config(io) {

    var nsp = io.of('/channel');

    nsp.on('connection', function(socket) {

        socket.on('join channel', function(channelId){
            socket.join(channelId);

            function cb(err, messages){
                messages.reverse();
                nsp.to(channelId).emit('new message', messages);
            }

            ChatBl.getChannelChat(channelId, cb);
        });



        socket.on('new message', function(chat){
            function cb(err, chat){
                nsp.to(chat.channel.ref).emit('new message', chat);
            }

            ChatBl.create(chat, cb);
        });

        socket.on('disconnect', function(){

        });
    });
}

exports.config = config;



