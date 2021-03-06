'use strict';

var mongoose = require('mongoose'),
    Message = mongoose.model('Message'),
    _ = require('lodash'),
    UserSocket = require('../../../fu/server/sockets/user.server.socket.config'),
    Conversation = mongoose.model('Conversation');

function config(io) {

    var nsp = io.of('/messages');

    nsp.on('connection', function(socket) {

        socket.on('new conversation', function(newConversation){

            //Find existing Private Messaging Room
            var query= {};
            var userQuery = [];

            _.each(newConversation.recipients, function(user){
                query = {$elemMatch: {name:''}};
                query.$elemMatch.name = user.name;
                userQuery.push(query);
            });

            Conversation.findOne({recipients: {$all: userQuery, $size : newConversation.recipients.length}}, function(err, conversation){
                if (conversation){
                    var message = new Message(newConversation.message);
                    message.conversation = conversation._id;
                    message.save();
                    socket.join(conversation._id);
                    nsp.to(conversation._id).emit('new conversation', conversation);
                    UserSocket.newMessage(conversation.recipients);
                } else {
                    var newConverationDb = new Conversation({recipients:newConversation.recipients, owner:newConversation.owner, subject:newConversation.subject, lastMessage: newConversation.message });
                    newConverationDb.save(function(){
                        var message = new Message(newConversation.message);
                        message.conversation = newConverationDb._id;
                        message.save();
                        socket.join(newConverationDb._id);
                        nsp.to(newConverationDb._id).emit('new conversation', newConverationDb);
                        UserSocket.newMessage(newConverationDb.recipients);
                    });
                }
            });
        });


        /*
         * Join Room
         */
        socket.on('join room', function(joinRoom){
            socket.join(joinRoom.conversationId);


            //Set message to read for specific user
            Conversation.update({_id: joinRoom.conversationId, 'recipients.ref': joinRoom.userId}, {$set:{'recipients.$.new': false}}, function(err, num){
            });
        });


        /*
         * Reply
         */
        socket.on('message reply', function(reply){
            Conversation.findById(reply.conversationId).exec(function(err, conversation){
                if (conversation){
                    var message = new Message(reply.message);
                    message.conversation = conversation._id;
                    message.save();
                    //set a recipients to new
                    for(var i=0; i<conversation.recipients.length;i++){
                        if(String(conversation.recipients[i].ref) !== String(reply.message.user.ref)){
                            conversation.recipients[i].new = true;
                        }
                    }
                    conversation.lastMessage = reply.message;
                    conversation.save();

                    // Populate User Info
                    Message.populate(message, {path: 'user.ref', model:'User', select: 'avatarUrl'},  function(err, message){
                        nsp.to(conversation._id).emit('message reply', message);
                        UserSocket.newMessage(conversation.recipients);
                    });
                }
            });
        });

        /*
         * Add Recipients
         */
        socket.on('add recipients', function(newRecipient){
            Conversation.findById(newRecipient.conversationId, function(err, conversation){
                if(conversation){
                    conversation.recipients = newRecipient.recipients;
                    conversation.save();
                    nsp.to(conversation._id).emit('add recipients', conversation.recipients);

                }
            });
        });

        /*
         * Leave Conversation
         */
        socket.on('leave conversation', function(leaveConversation){
            Conversation.findById(leaveConversation.conversationId, function(err, conversation){
                if(conversation){
                    var message = new Message({user: {name: leaveConversation.user.username , ref: leaveConversation.user._id}, message: leaveConversation.user.username  + ' has left.'});
                    message.conversation = conversation._id;
                    message.save();
                    conversation.recipients = _.remove(conversation.recipients, function(recipients){
                        return String(recipients.ref) !== String(leaveConversation.user._id);
                    });
                    conversation.save();
                }
            });
        });

        socket.on('leave room', function(conversationId){
            socket.leave(conversationId);
        });
    });
}

exports.config = config;