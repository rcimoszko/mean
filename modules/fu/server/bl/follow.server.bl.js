'use strict';

var _ = require('lodash'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    NotificationBl = require('./notification.server.bl'),
    EmailBl = require('./email.server.bl'),
    Follow = mongoose.model('Follow');


var populate = [];

function get(id, callback){

    function cb(err, sport){
        callback(err, sport);
    }

    Follow.findById(id).exec(cb);
}


function update(data, follow, callback) {

    function cb(err){
        callback(err, follow);
    }

    follow = _.extend(follow, data);

    follow.save(cb);
}


function findOneByQuery(query, callback){
    Follow.findOne(query, callback);
}

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

function createFollow(user, userFollow, hostName, sendSocket, callback){
    var todo = [];

    function create(callback){
        var data = {
            follower: {name: user.username, ref:user._id},
            following: {name: userFollow.username, ref:userFollow._id},
            startDate: new Date(),
            endDate: null
        };

        var follow = new Follow(data);

        function cb(err){
            callback(err, follow);
        }

        follow.save(cb);
    }


    function createNotification(follow, callback){
        function cb(err){
            callback(err, follow);
        }
        NotificationBl.createFollowNotification(userFollow, user, follow, sendSocket, cb);
    }

    function sendEmail(follow, callback){
        if(!userFollow.newFollowerEmail) return callback(null, follow);
        if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'cloud-foundry' ) return callback(null, follow); //don't send emails if not in production

        EmailBl.sendFollowerEmail(userFollow, user.username, hostName, function cb(err){});
        return callback(null, follow);
    }

    todo.push(create);
    todo.push(createNotification);
    todo.push(sendEmail);

    async.waterfall(todo, callback);
}

function updateFollow(follow, callback){
    follow.startDate = new Date();
    follow.endDate = null;

    function cb(err){
        callback(err, follow);
    }

    follow.save(cb);
}

function follow(user, userFollow, hostName, sendSocket, callback){
    var todo = [];

    function findFollow(callback){
        var query = {'follower.ref':user._id, 'following.ref':userFollow._id};
        findOneByQuery(query, callback);
    }

    function followUser(follow, callback){
        if(follow){
            updateFollow(follow, callback);
        } else {
            createFollow(user, userFollow, hostName, sendSocket, callback);
        }
    }

    function updateCount(follow, callback){
        function cb(err){
            callback(err, follow);
        }
        updateFollowCount(user, userFollow, cb);
    }

    function processReturnData(follow, callback){
        var json = {
            _id: userFollow._id,
            avatarUrl: userFollow.avatarUrl,
            username: userFollow.username
        };
        callback(null, json);
    }

    todo.push(findFollow);
    todo.push(followUser);
    todo.push(updateCount);
    todo.push(processReturnData);

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

function getFollowerListForEmails(userId, callback){
    Follow.find({'following.ref':userId, endDate: null, 'follower.ref':{$exists: true}}).populate({path: 'follower.ref'}).exec(callback);
}

function getFollowingListSettings(userId, callback){
    Follow.find({'follower.ref':userId, endDate: null, 'following.ref':{$exists: true}}).populate({path: 'following.ref'}).exec(callback);
}


function aggregate(array, callback){
    Follow.aggregate(array).exec(callback);
}

function populateBy(follows, populate, callback){
    Follow.populate(follows, populate, callback);
}

function getByQuery(query, callback){
    Follow.find(query, callback);
}


function updateNotify(data, follow, callback) {

    var todo = [];

    function update_todo(callback){
        update(data, follow, callback);
    }

    function populate_todo(follow, callback){
        Follow.populate(follow, {path: 'following.ref', model: 'User'}, callback);
    }

    todo.push(update_todo);
    todo.push(populate_todo);

    async.waterfall(todo, callback);
}


exports.get                 = get;
exports.update              = update;
exports.follow              = follow;
exports.unfollow            = unfollow;
exports.getFollowingList    = getFollowingList;
exports.getFollowerList     = getFollowerList;
exports.getFollowerList     = getFollowerList;
exports.getFollowingListSettings     = getFollowingListSettings;
exports.getFollowerListForEmails     = getFollowerListForEmails;
exports.updateNotify     = updateNotify;
exports.aggregate       = aggregate;
exports.populateBy       = populateBy;
exports.getByQuery       = getByQuery;