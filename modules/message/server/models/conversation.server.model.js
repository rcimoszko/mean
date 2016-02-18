'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema;

var RecipientSchema = new Schema({
        name:   String,
        ref:    {type: Schema.ObjectId, ref: 'User'},
        new:    {type:Boolean, default:true}},
    { _id: false }
);

var ConversationSchema = new Schema({
    recipients:     [RecipientSchema],
    subject:        {type: String, default: '(No Subject)', trim: true},
    owner:          {name:String, ref: {type: Schema.ObjectId, ref: 'User'}},
    lastMessage:    {timestamp: {type: Date, default: Date.now}, message: {type: String, default: '', trim: true}, user: {name: String, ref: {type: Schema.ObjectId,ref: 'User'}}},
    timestamp:      {type: Date, default: Date.now},
    oldId:          {type: Number}
});

ConversationSchema.pre('save', function (next) {
    this.timestamp = Date.now();
    return next();
});

ConversationSchema.statics.getConversationList = function(userId, callback){
    this.find({recipients: {$elemMatch: {ref: userId}}}).sort('timestamp').limit(200).populate('lastMessage.user.ref').exec(function(err, conversations){
        if(err){
            console.log(err);
        } else {
            conversations.reverse();
            var sorted = _.sortBy(conversations, function(conversation){
                var recipient = _.find(conversation.recipients, {ref: mongoose.Types.ObjectId(userId)});
                return recipient.new === false;
            });
            callback(sorted);
        }
    });
};

mongoose.model('Conversation', ConversationSchema);