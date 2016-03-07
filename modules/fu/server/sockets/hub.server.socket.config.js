'use strict';

var mongoose = require('mongoose'),
    ChatBl = require('../bl/chat.server.bl');

function config(io) {

    var nsp = io.of('/hub');

    nsp.on('connection', function(socket) {

        socket.on('new message', function(chat){
            function cb(err, chat){
                nsp.emit('new message', chat);
            }

            ChatBl.create(chat, cb);
        });

        socket.on('disconnect', function(){
        });
    });
}

exports.config = config;



