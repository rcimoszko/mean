'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    PinnacleLeague = mongoose.model('PinnacleLeague'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, pinnacleLeague;

describe('/api/pinnacle/leagues', function () {

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

        function createPinnacleLeague(callback){
            pinnacleLeague = new PinnacleLeague({
                name: 'Pinnacle League Name'
            });
            pinnacleLeague.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createPinnacleLeague);

        async.waterfall(todo, done);
    });


    it('should not be able a single pinnacle league if guest', function (done) {
        agent.get('/api/pinnacle/leagues/' + pinnacleLeague._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get a single pinnacle leagues if user', function (done) {
        var req = request.get('/api/pinnacle/leagues/' + pinnacleLeague._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });


    it('should be able get a single pinnacle league if admin', function (done) {
        var req = request.get('/api/pinnacle/leagues/' + pinnacleLeague._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', pinnacleLeague.name);
                done();
            });
    });


    it('should not be able to update pinnacle league if guest', function (done) {
        pinnacleLeague.name = 'change';

        agent.put('/api/pinnacle/leagues/' + pinnacleLeague._id)
            .send(pinnacleLeague)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update pinnacle leagues if user', function (done) {
        pinnacleLeague.name = 'change';

        var req = request.put('/api/pinnacle/leagues/' + pinnacleLeague._id);
        userAgent.attachCookies(req);
        req.send(pinnacleLeague)
            .send(pinnacleLeague)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update pinnacle leagues if admin', function (done) {
        pinnacleLeague.name = 'changed';

        var req = request.put('/api/pinnacle/leagues/' + pinnacleLeague._id);
        adminAgent.attachCookies(req);
        req.send(pinnacleLeague)
            .send(pinnacleLeague)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(pinnacleLeague._id));
                (res.body.name).should.match('changed');
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            PinnacleLeague.remove().exec(done);
        });
    });

});