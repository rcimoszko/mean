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

describe('/api/channels/{id}/unsubscribe', function () {

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



    it('should not be able to ununsubscribe to channel if guest', function (done) {
        agent.put('/api/channels/' + channel._id + '/unsubscribe')
            .send(channel)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to unsubscribe to channel if user', function (done) {
        var req = request.post('/api/channels/' + channel._id + '/unsubscribe');
        userAgent.attachCookies(req);
        req.send(channel)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body.message).should.equal('unsubscribed');
                done();
            });
    });

    it('should be able to unsubscribe to channel if admin', function (done) {
        var req = request.post('/api/channels/' + channel._id + '/unsubscribe');
        adminAgent.attachCookies(req);
        req.send()
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body.message).should.equal('unsubscribed');
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            Channel.remove().exec(done);
        });
    });

});