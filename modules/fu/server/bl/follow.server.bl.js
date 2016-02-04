'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Follow = mongoose.model('Follow');


var populate = [];

function getFollowCount(user, callback){
    var userId = new mongoose.Types.ObjectId(user._id);

    var match = {
        $match: {$or:[{'follower.ref':userId},{'following.ref':userId}]}
    };
    var group = {
        $group: {
            _id: null,
            followingCount: {$sum:{ $cond:[ {$and:[{$eq: [ "$follower.ref", userId ]}, {$eq: [ "$endDate", null ]}]}, 1, 0]}},
            followerCount: {$sum:{ $cond:[ {$and:[{$eq: [ "$following.ref", userId ]}, {$eq: [ "$endDate", null ]}]}, 1, 0]}}
        }
    };
    function cb(err, count){
        if(count.length) count = count[0];
        callback(err, count);
    }

    Follow.aggregate([match, group]).exec(cb);
}

function updateFollowCount(user, userFollow, callback){

    var todo = [];

    function getCountForUser(callback){
        getFollowCount(user, callback);
    }

    function updateUser(count, callback){
        if (!count) return callback(null);
        var update = {
            followingCount: count.followingCount,
            followerCount: count.followerCount
        };
        function cb(err, user){
            callback(err);
        }
        User.update({_id:user._id}, update, cb);
    }

    function getCountForUserFollow(callback){
        getFollowCount(userFollow, callback);
    }

    function updateUserFollow(count, callback){
        if (!count) return callback(null);
        var update = {
            followingCount: count.followingCount,
            followerCount: count.followerCount
        };
        function cb(err, user){
            callback(err);
        }
        User.update({_id:userFollow._id}, update, cb);
    }

    todo.push(getCountForUser);
    todo.push(updateUser);
    todo.push(getCountForUserFollow);
    todo.push(updateUserFollow);

    async.waterfall(todo, callback);
}

function follow(user, userFollow, callback){
    var todo = [];

    function followUser(callback){
        var update = {
            follower: {name: user.username, ref:user._id},
            following: {name: userFollow.username, ref:userFollow._id},
            startDate: new Date(),
            endDate: null
        };
        Follow.findOneAndUpdate({'follower.ref':user._id, 'following.ref':userFollow._id}, update, {new:true, upsert:true}, callback);
    }

    function updateCount(follow, callback){
        function cb(err){
            callback(err, follow);
        }
        updateFollowCount(user, userFollow, cb);

    }

    todo.push(followUser);
    todo.push(updateCount);

    async.waterfall(todo, callback);

}

function unfollow(user, userUnfollow, callback){

    var todo = [];

    function followUser(callback){
        var update = {
            follower: {name: user.username, ref:user._id},
            following: {name: userUnfollow.username, ref:userUnfollow._id},
            startDate: new Date(),
            endDate: new Date()
        };
        Follow.findOneAndUpdate({'follower.ref':user._id, 'following.ref':userUnfollow._id}, update, {new:true, upsert:true}, callback);
    }

    function updateCount(follow, callback){
        function cb(err){
            callback(err, follow);
        }
        updateFollowCount(user, userUnfollow, cb);

    }

    todo.push(followUser);
    todo.push(updateCount);

    async.waterfall(todo, callback);

}


function getFollowingList(userId, callback){
    function cb(err, follows){
        var followingList = _.chain(follows).pluck('following').pluck('ref').value();
        callback(err, followingList);
    }

    Follow.find({'follower.ref':userId, endDate:null, 'following.ref':{$exists: true}}).populate({path: 'following.ref', select: 'avatarUrl username'}).exec(cb);
}

function getFollowerList(userId, callback){
    Follow.find({'following.ref':userId, endDate: null, 'follower.ref':{$exists: true}}).populate({path: 'follower.ref', select: 'avatarUrl username'}).exec(callback);
}

exports.follow              = follow;
exports.unfollow            = unfollow;
exports.getFollowingList    = getFollowingList;
exports.getFollowerList     = getFollowerList;