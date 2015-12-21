'use strict';

var superagent = require('superagent'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    adminAgent = superagent.agent(),
    userAgent = superagent.agent();

exports.signinUser = function (request, done) {

    var credentials = {
        username: 'username_user',
        password: 'M3@n.jsI$Aw3$0m3'
    };
    var todo = [];

    function createUser(callback){
        var user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test_user@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local'
        });

        function cb(err, user){
            callback(err);
        }

        user.save(cb);
    }

    function signin(callback){

        function cb(err, res){
            callback(err, res);
        }

        request.post('/api/auth/signin').send(credentials).end(cb);
    }

    function cb(err, res){
        if (err)  throw err;
        userAgent.saveCookies(res);
        done(userAgent, res.body);
    }

    todo.push(createUser);
    todo.push(signin);

    async.waterfall(todo, cb);

};


exports.signinAdmin = function (request, done) {


    var credentials = {
        username: 'username_admin',
        password: 'M3@n.jsI$Aw3$0m3'
    };
    var todo = [];

    function createUser(callback){
        var user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test_admin@test.com',
            username: credentials.username,
            password: credentials.password,
            provider: 'local',
            roles: ['user','admin']
        });

        function cb(err, user){
            callback(err);
        }

        user.save(cb);
    }

    function signin(callback){
        function cb(err, res){
            callback(err, res);
        }

        request.post('/api/auth/signin').send(credentials).end(cb);
    }

    function cb(err, res){
        if (err)  throw err;
        adminAgent.saveCookies(res);
        done(adminAgent, res.body);
    }

    todo.push(createUser);
    todo.push(signin);

    async.waterfall(todo, cb);
};








