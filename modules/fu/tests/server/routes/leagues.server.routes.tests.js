'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    League = mongoose.model('League'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, league;

describe('/api/leagues', function () {

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

        function createLeague(callback){
            league = new League({
                name: 'league name'
            });
            league.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createLeague);

        async.waterfall(todo, done);
    });



    it('should not be able get list of leagues if guest', function (done) {
        agent.get('/api/leagues')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of leagues if query not provided and user', function (done) {
        var req = request.get('/api/leagues');
        userAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of leagues if query not provided and admin', function (done) {
        var req = request.get('/api/leagues');
        adminAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });


    it('should be able get list of leagues if query provided and user', function (done) {
        var req = request.get('/api/leagues?name=league name');
        userAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    it('should be able get list of leagues if query provided and admin', function (done) {
        var req = request.get('/api/leagues?name=league name');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });


    it('should not be able to get a single league if guest', function (done) {
        agent.get('/api/leagues/' + league._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to get a single league if user', function (done) {
        var req = request.get('/api/leagues/' + league._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to get a single league if admin', function (done) {
        var req = request.get('/api/leagues/' + league._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', league.name);
                done();
            });
    });


    it('should not be able to update a single league if guest', function (done) {
        league.name = 'changed';

        agent.put('/api/leagues/' + league._id)
            .send(league)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update a single league if user', function (done) {
        league.name = 'change';

        var req = request.put('/api/leagues/' + league._id);
        userAgent.attachCookies(req);
        req.send(league)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update a single league if admin', function (done) {
        league.name = 'changed';

        var req = request.put('/api/leagues/' + league._id);
        adminAgent.attachCookies(req);
        req.send(league)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(league._id));
                (res.body.name).should.match('changed');
                done();
            });
    });


    it('should not be able to delete an league if guest', function (done) {
        agent.delete('/api/leagues/' + league._id)
            .send(league)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to delete an league if user', function (done) {
        var req = request.delete('/api/leagues/' + league._id);
        userAgent.attachCookies(req);
        req.send(league)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to delete an league if admin', function (done) {
        var req = request.delete('/api/leagues/' + league._id);
        adminAgent.attachCookies(req);
        req.send(league)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(league._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            League.remove().exec(done);
        });
    });

});
