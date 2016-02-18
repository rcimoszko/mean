'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    Conversation = mongoose.model('Conversation');


function getByUser(user, callback){
    var query = {'recipients.ref': user._id};
    Conversation.find(query).sort('timestamp').limit(200).populate('lastMessage.user.ref').exec(callback);

}

function createConversation(data, user, callback) {

    var todo = [];
    console.log(data);

    function findExistingConversation(callback) {

        var userQueryArray = [];

        _.each(data.recipients, function (user) {
            var userQuery = {$elemMatch: {name: ''}};
            userQuery.$elemMatch.name = user.name;
            userQueryArray.push(userQuery);
        });

        var query = {recipients: {$all: userQueryArray, $size: data.recipients.length}};
        console.log(query);
        Conversation.findOne(query, callback);

    }

    function updateOrCreateConversation(conversation, callback) {
        console.log(conversation);

        if (conversation) {
            var message = new Message(data.message);
            message.conversation = conversation._id;
            message.save();
            callback(null, conversation);
            //socket.join(conversation._id);
            //nsp.to(conversation._id).emit('new conversation', conversation);
            //userSocket.newMessage(conversation.recipients);
        } else {
            conversation = {
                recipients:     data.recipients,
                subject:        data.subject,
                owner:          {name: user.username, ref: user._id },
                lastMessage:    data.message
            };

            conversation = new Conversation(conversation);
            conversation.save(function (err) {
                var message = new Message(data.message);
                message.conversation = conversation._id;
                message.save();
                callback(null, conversation);
                //socket.join(newConverationDb._id);
                //nsp.to(newConverationDb._id).emit('new conversation', newConverationDb);
                //userSocket.newMessage(newConverationDb.recipients);
            });
        }
    }

    todo.push(findExistingConversation);
    todo.push(updateOrCreateConversation);

    async.waterfall(todo, callback);
}

exports.getByUser           = getByUser;
exports.createConversation  = createConversation;