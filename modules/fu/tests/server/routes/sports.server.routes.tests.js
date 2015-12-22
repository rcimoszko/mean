'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Sport = mongoose.model('Sport'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, sport;

describe('/api/sports', function () {

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

        function createSport(callback){
            sport = new Sport({
                name: 'sport name'
            });
            sport.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createSport);

        async.waterfall(todo, done);
    });



    it('should not be able get list of sports if guest', function (done) {
        agent.get('/api/sports')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });


    it('should be able get list of sports if query provided and user', function (done) {
        var req = request.get('/api/sports?name=sport name');
        userAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    it('should be able get list of sports if query provided and admin', function (done) {
        var req = request.get('/api/sports?name=sport name');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });


    it('should not be able to get a single sport if guest', function (done) {
        agent.get('/api/sports/' + sport._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to get a single sport if user', function (done) {
        var req = request.get('/api/sports/' + sport._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to get a single sport if admin', function (done) {
        var req = request.get('/api/sports/' + sport._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', sport.name);
                done();
            });
    });


    it('should not be able to update a single sport if guest', function (done) {
        sport.name = 'changed';

        agent.put('/api/sports/' + sport._id)
            .send(sport)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update a single sport if user', function (done) {
        sport.name = 'change';

        var req = request.put('/api/sports/' + sport._id);
        userAgent.attachCookies(req);
        req.send(sport)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update a single sport if admin', function (done) {
        sport.name = 'changed';

        var req = request.put('/api/sports/' + sport._id);
        adminAgent.attachCookies(req);
        req.send(sport)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(sport._id));
                (res.body.name).should.match('changed');
                done();
            });
    });


    it('should not be able to delete an sport if guest', function (done) {
        agent.delete('/api/sports/' + sport._id)
            .send(sport)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to delete an sport if user', function (done) {
        var req = request.delete('/api/sports/' + sport._id);
        userAgent.attachCookies(req);
        req.send(sport)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to delete an sport if admin', function (done) {
        var req = request.delete('/api/sports/' + sport._id);
        adminAgent.attachCookies(req);
        req.send(sport)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(sport._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            Sport.remove().exec(done);
        });
    });

});
