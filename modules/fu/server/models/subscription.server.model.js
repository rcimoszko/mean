'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubscriptionSchema = new Schema({
    user:       {name: String, ref: {type: Schema.ObjectId, ref: 'User'}},
    channel:    {name: String, ref: {type: Schema.ObjectId, ref: 'Channel'}}
});

mongoose.model('Subscription', SubscriptionSchema);