'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    PinnacleSport = mongoose.model('PinnacleSport'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, pinnacleSport;

describe('/api/pinnacle/sports', function () {

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

        function createPinnacleSport(callback){
            pinnacleSport = new PinnacleSport({
                name: 'Pinnacle Sport Name'
            });
            pinnacleSport.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createPinnacleSport);

        async.waterfall(todo, done);
    });


    it('should not be able get list of pinnacle sports if guest', function (done) {
        agent.get('/api/pinnacle/sports')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of pinnacle sports if user', function (done) {
        var req = request.get('/api/pinnacle/sports');
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able get list of pinnacle sports if admin', function (done) {
        var req = request.get('/api/pinnacle/sports');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });


    it('should not be able a single pinnacle sport if guest', function (done) {
        agent.get('/api/pinnacle/sports/' + pinnacleSport._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get a single pinnacle sports if user', function (done) {
        var req = request.get('/api/pinnacle/sports/' + pinnacleSport._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });


    it('should be able get a single pinnacle sport if admin', function (done) {
        var req = request.get('/api/pinnacle/sports/' + pinnacleSport._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', pinnacleSport.name);
                done();
            });
    });


    it('should not be able to update pinnacle sport if guest', function (done) {
        pinnacleSport.name = 'change';

        agent.put('/api/pinnacle/sports/' + pinnacleSport._id)
            .send(pinnacleSport)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update pinnacle sports if user', function (done) {
        pinnacleSport.name = 'change';

        var req = request.put('/api/pinnacle/sports/' + pinnacleSport._id);
        userAgent.attachCookies(req);
        req.send(pinnacleSport)
            .send(pinnacleSport)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update pinnacle sports if admin', function (done) {
        pinnacleSport.name = 'changed';

        var req = request.put('/api/pinnacle/sports/' + pinnacleSport._id);
        adminAgent.attachCookies(req);
        req.send(pinnacleSport)
            .send(pinnacleSport)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(pinnacleSport._id));
                (res.body.name).should.match('changed');
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            PinnacleSport.remove().exec(done);
        });
    });

});