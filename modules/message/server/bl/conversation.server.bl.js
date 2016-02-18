'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Conversation = mongoose.model('Conversation');


function getByUser(user, callback){
    var query = {'recipients.ref': user._id};
    Conversation.find(query).sort('timestamp').limit(200).populate('lastMessage.user.ref').exec(callback);

    /*

     conversations.reverse();
     var sorted = _.sortBy(conversations, function(conversation){
     var recipient = _.find(conversation.recipients, {ref: mongoose.Types.ObjectId(userId)});
     return recipient.new === false;
     });
     callback(sorted);
     */
}

exports.getByUser = getByUser;