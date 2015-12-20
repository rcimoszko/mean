'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    PinnacleContestant = mongoose.model('PinnacleContestant'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, pinnacleContestant;

describe('/api/pinnacle/contestants', function () {

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

        function createPinnacleContestant(callback){
            pinnacleContestant = new PinnacleContestant({
                name: 'Pinnacle Contestant Name'
            });
            pinnacleContestant.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createPinnacleContestant);

        async.waterfall(todo, done);
    });


    it('should not be able a single pinnacle contestant if guest', function (done) {
        agent.get('/api/pinnacle/contestants/' + pinnacleContestant._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get a single pinnacle contestants if user', function (done) {
        var req = request.get('/api/pinnacle/contestants/' + pinnacleContestant._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });


    it('should be able get a single pinnacle contestant if admin', function (done) {
        var req = request.get('/api/pinnacle/contestants/' + pinnacleContestant._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', pinnacleContestant.name);
                done();
            });
    });


    it('should not be able to update pinnacle contestant if guest', function (done) {
        pinnacleContestant.name = 'change';

        agent.put('/api/pinnacle/contestants/' + pinnacleContestant._id)
            .send(pinnacleContestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update pinnacle contestants if user', function (done) {
        pinnacleContestant.name = 'change';

        var req = request.put('/api/pinnacle/contestants/' + pinnacleContestant._id);
        userAgent.attachCookies(req);
        req.send(pinnacleContestant)
            .send(pinnacleContestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update pinnacle contestants if admin', function (done) {
        pinnacleContestant.name = 'changed';

        var req = request.put('/api/pinnacle/contestants/' + pinnacleContestant._id);
        adminAgent.attachCookies(req);
        req.send(pinnacleContestant)
            .send(pinnacleContestant)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(pinnacleContestant._id));
                (res.body.name).should.match('changed');
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            PinnacleContestant.remove().exec(done);
        });
    });

});