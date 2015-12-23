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

describe('/api/channels', function () {

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



    it('should not be able get list of channels if guest', function (done) {
        agent.get('/api/channels')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });


    it('should not be able get list of channels if query not provided and user', function (done) {
        var req = request.get('/api/channels');
        userAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of channels if query not provided and admin', function (done) {
        var req = request.get('/api/channels');
        adminAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able get list of channels if query provided and user', function (done) {
        var req = request.get('/api/channels?name=channel-name');
        userAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    it('should be able get list of channels if query provided and admin', function (done) {
        var req = request.get('/api/channels?name=channel-name');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });


    it('should not be able to get a single channel if guest', function (done) {
        agent.get('/api/channels/' + channel._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to get a single channel if user', function (done) {
        var req = request.get('/api/channels/' + channel._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to get a single channel if admin', function (done) {
        var req = request.get('/api/channels/' + channel._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', channel.name);
                done();
            });
    });


    it('should not be able to update a single channel if guest', function (done) {
        channel.name = 'changed';

        agent.put('/api/channels/' + channel._id)
            .send(channel)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update a single channel if user', function (done) {
        channel.name = 'change';

        var req = request.put('/api/channels/' + channel._id);
        userAgent.attachCookies(req);
        req.send(channel)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update a single channel if admin', function (done) {
        channel.name = 'changed';

        var req = request.put('/api/channels/' + channel._id);
        adminAgent.attachCookies(req);
        req.send(channel)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(channel._id));
                (res.body.name).should.match('changed');
                done();
            });
    });

    it('should not be able to delete an channel if guest', function (done) {
        agent.delete('/api/channels/' + channel._id)
            .send(channel)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to delete an channel if user', function (done) {
        var req = request.delete('/api/channels/' + channel._id);
        userAgent.attachCookies(req);
        req.send(channel)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });



    it('should be able to delete an channel if admin', function (done) {
        var req = request.delete('/api/channels/' + channel._id);
        adminAgent.attachCookies(req);
        req.send(channel)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(channel._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            Channel.remove().exec(done);
        });
    });

});