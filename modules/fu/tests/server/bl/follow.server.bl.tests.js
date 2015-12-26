'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    Follow = mongoose.model('Follow'),
    User = mongoose.model('User'),
    FollowBl = require('../../../server/bl/follow.server.bl'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var user1Agent, user2Agent, user1, user2;

describe('follow.server.bl', function () {

    before(function (done) {

        var todo = [];

        function signInUser1(callback){
            userHelper.signinUser(request, function (agent, signinUser) {
                user1Agent = agent;
                user1 = signinUser;
                callback();
            });
        }


        function signInUser2(callback){
            userHelper.signinAdmin(request, function (agent, signinUser) {
                user2Agent = agent;
                user2 = signinUser;
                callback();
            });
        }


        todo.push(signInUser1);
        todo.push(signInUser2);

        async.waterfall(todo, done);
    });



    it('user1 should be able to follow user2', function (done) {
        var todo = [];

        function followUser(callback){
            function cb(err, follow){
                (String(follow.follower.ref)).should.match(String(user1._id));
                (String(follow.following.ref)).should.match(String(user2._id));
                should.not.exist(follow.endDate);

                callback(err);
            }

            FollowBl.follow(user1, user2, cb);
        }

        function checkUserFollow1Count(callback){

            var todo = [];
            function checkUser1(callback){
                User.findById(user1._id, function(err, user){
                    (user.followingCount).should.match(1);
                    callback(err);
                });
            }

            function checkUser2(callback){
                User.findById(user2._id, function(err, user){
                    (user.followerCount).should.match(1);
                    callback(err);

                });
            }

            todo.push(checkUser1);
            todo.push(checkUser2);

            function cb(err){
                callback(err);
            }

            async.parallel(todo, cb);
        }

        function unfollowUser(callback){
            function cb(err, follow){
                (String(follow.follower.ref)).should.match(String(user1._id));
                (String(follow.following.ref)).should.match(String(user2._id));
                should.notEqual(follow.endDate, null);
                callback(err);
            }

            FollowBl.unfollow(user1, user2, cb);
        }

        function checkUserFollow2Count(callback){

            var todo = [];
            function checkUser1(callback){
                User.findById(user1._id, function(err, user){
                    (user.followingCount).should.match(0);
                    callback(err);
                });
            }

            function checkUser2(callback){
                User.findById(user2._id, function(err, user){
                    (user.followerCount).should.match(0);
                    callback(err);

                });
            }

            todo.push(checkUser1);
            todo.push(checkUser2);

            function cb(err){
                callback(err);
            }

            async.parallel(todo, cb);
        }

        todo.push(followUser);
        todo.push(checkUserFollow1Count);
        todo.push(unfollowUser);
        todo.push(checkUserFollow2Count);

        async.waterfall(todo, done);

    });


    after(function (done) {
        User.remove().exec(function () {
            Follow.remove().exec(done);
        });
    });

});