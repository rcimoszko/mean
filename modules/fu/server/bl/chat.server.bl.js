'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Chat = mongoose.model('Chat');

function getHubChat(callback){
    function cb(err, messages){
        messages.reverse();
        callback(err, messages);
    }

    Chat.find({channel:{$exists:false}}).sort('-timestamp').limit(40).exec(cb);
}

function getChannelChat(channelId, callback){
    function cb(err, messages){
        messages.reverse();
        callback(err, messages);
    }

    Chat.find({'channel.ref':channelId}).sort('-timestamp').limit(40).exec(cb);
}

function create(data, callback){

    function cb(err){
        callback(err, chat);
    }

    var chat = new Chat(data);

    chat.save(cb);
}

exports.getChannelChat = getChannelChat;
exports.getHubChat = getHubChat;
exports.create = create;