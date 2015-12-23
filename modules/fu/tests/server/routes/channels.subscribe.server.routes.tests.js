'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Channel = mongoose.model('Channel'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, channel;

describe('/api/channels/{id}/subscribe', function () {

    before(function (done) {

        var todo = [];

        function signInUser(callback){
            userHelper.signinUser(request, function (agent, signinUser) {
                userAgent = agent;
                user = signinUser;
                callback();
            });

        }

        function signInAdmin(callback){
            userHelper.signinAdmin(request, function (agent, adminUser) {
                adminAgent = agent;
                admin = adminUser;
                callback();
            });
        }

        function createChannel(callback){
            channel = new Channel({
                name: 'channel-name',
                type: 'sport'
            });
            channel.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createChannel);

        async.waterfall(todo, done);
    });



    it('should not be able to subscribe to channel if guest', function (done) {
        agent.put('/api/channels/' + channel._id + '/subscribe')
            .send(channel)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to subscribe to channel if user', function (done) {
        var req = request.post('/api/channels/' + channel._id + '/subscribe');
        userAgent.attachCookies(req);
        req.send(channel)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body.channel.ref).should.equal(String(channel._id));
                (res.body.user.ref).should.equal(String(user._id));
                done();
            });
    });

    it('should be able to subscribe to channel if admin', function (done) {
        var req = request.post('/api/channels/' + channel._id + '/subscribe');
        adminAgent.attachCookies(req);
        req.send()
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body.channel.ref).should.equal(String(channel._id));
                (res.body.user.ref).should.equal(String(admin._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            Channel.remove().exec(done);
        });
    });

});