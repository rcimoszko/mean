'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    MessageBl = require('./message.server.bl'),
    Conversation = mongoose.model('Conversation');


function get(id, callback){

    function cb(err, bet){
        callback(err, bet);
    }

    Conversation.findById(id).exec(cb);
}

function create(data, callback) {

    function cb(err){
        callback(err, conversation);
    }

    var conversation = new Conversation(data);

    conversation.save(cb);
}

function getByQuery(query, callback){
    Conversation.find(query).sort('-timestamp').limit(200).populate('lastMessage.user.ref', 'username avatarUrl').exec(callback);
}
function getOneByQuery(query, callback){
    Conversation.findOne(query).populate('lastMessage.user.ref', 'username avatarUrl').exec(callback);
}

function getByUser(user, callback){
    var query = {'recipients.ref': user._id};
    getByQuery(query, callback);
}

function createConversation(data, user, callback) {

    var todo = [];

    function findExistingConversation(callback) {

        var userQueryArray = [];

        _.each(data.recipients, function (user) {
            var userQuery = {$elemMatch: {name: ''}};
            userQuery.$elemMatch.name = user.name;
            userQueryArray.push(userQuery);
        });

        var query = {recipients: {$all: userQueryArray, $size: data.recipients.length}};
        getOneByQuery(query, callback);

    }

    function updateOrCreateConversation(conversation, callback) {

        if (conversation) {
            var message = new Message(data.message);
            message.conversation = conversation._id;

            MessageBl.create(message, function(err, message){
                callback(null, conversation);
                //socket.join(conversation._id);
                //nsp.to(conversation._id).emit('new conversation', conversation);
                //userSocket.newMessage(conversation.recipients);
            });

        } else {
            conversation = {
                recipients:     data.recipients,
                subject:        data.subject,
                owner:          {name: user.username, ref: user._id },
                lastMessage:    data.message
            };

            create(conversation, function (err, conversation) {
                var message = data.message;
                message.conversation = conversation._id;

                MessageBl.create(message, function(err){
                    callback(null, conversation);
                    //socket.join(newConverationDb._id);
                    //nsp.to(newConverationDb._id).emit('new conversation', newConverationDb);
                    //userSocket.newMessage(newConverationDb.recipients);
                });
            });
        }
    }

    todo.push(findExistingConversation);
    todo.push(updateOrCreateConversation);

    async.waterfall(todo, callback);
}

function getConversation(user, conversation, callback){


    var todo = [];

    function checkPermissions(callback){
        var found = _.filter(conversation.recipients, function(recipient){
            return String(recipient.ref) === String(user._id);
        });

        if(found.length === 0) return callback('No Permissions');
        callback();
    }

    function getMessages(callback){
        conversation = conversation.toJSON();
        function cb(err, messages){
            conversation.messages = messages;
            callback(err, conversation);
        }

        Message.find({conversation:conversation._id}).populate('user.ref').sort('timestamp').exec(cb);

    }

    todo.push(checkPermissions);
    todo.push(getMessages);

    async.waterfall(todo, callback);

}

function getNewMessageCount(userId, callback){
    Conversation.count({recipients: {$elemMatch:{ref: userId, new: true}}}).exec(callback);
}

exports.getByUser           = getByUser;
exports.createConversation  = createConversation;
exports.getConversation     = getConversation;
exports.get                 = get;
exports.getNewMessageCount  = getNewMessageCount;
