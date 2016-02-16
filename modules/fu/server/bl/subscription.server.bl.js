'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    Subscription = mongoose.model('Subscription');

function subscribe(user, channel, callback){
    var query = {
        'user.ref':     user._id,
        'channel.ref':  channel._id
    };

    var doc = {
        user:     {name:  user.username, ref: user._id},
        channel:  {name:  channel.name, ref: channel._id}
    };

    function cb(err, subscription){
        callback(err, channel);
    }

    Subscription.findOneAndUpdate(query, doc, {upsert: true, new:true}, cb);
}

function unsubscribe(user, channel, callback){

    function cb(err, subscription){
        callback(err, channel);
    }

    Subscription.remove({'user.ref': user._id, 'channel.ref': channel._id}, cb);
}

function getByUser(user, callback){
    Subscription.find({'user.ref': user._id}).populate('channel.ref').exec(callback);
}

exports.subscribe       = subscribe;
exports.unsubscribe     = unsubscribe;

exports.getByUser     = getByUser;