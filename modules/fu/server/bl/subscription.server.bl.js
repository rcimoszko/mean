'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Subscription = mongoose.model('Subscription');

function subscribe(user, channel, callback){
    var data = {
        user:       {name:  user.username, ref: user._id},
        channel:    {name:  channel.name, ref: channel._id}
    };
    Subscription.findOneAndUpdate(data, data, {upsert: true, new:true}, callback);
}

function unsubscribe(user, channel, callback){
    Subscription.remove({'user.ref': user._id, 'channel.ref': channel._id}, callback);
}

exports.subscribe       = subscribe;
exports.unsubscribe     = unsubscribe;