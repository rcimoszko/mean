'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Contestant = mongoose.model('Contestant'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, contestant;

describe('/api/contestants', function () {

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

        function createContestant(callback){
            contestant = new Contestant({
                name: 'contestant-name'
            });
            contestant.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createContestant);

        async.waterfall(todo, done);
    });



    it('should not be able get list of contestants if guest', function (done) {
        agent.get('/api/contestants')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });


    it('should not be able get list of contestants if query not provided and user', function (done) {
        var req = request.get('/api/contestants');
        userAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of contestants if query not provided and admin', function (done) {
        var req = request.get('/api/contestants');
        adminAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able get list of contestants if query provided and user', function (done) {
        var req = request.get('/api/contestants?name=contestant-name');
        userAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    it('should be able get list of contestants if query provided and admin', function (done) {
        var req = request.get('/api/contestants?name=contestant-name');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });


    it('should not be able to get a single contestant if guest', function (done) {
        agent.get('/api/contestants/' + contestant._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to get a single contestant if user', function (done) {
        var req = request.get('/api/contestants/' + contestant._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to get a single contestant if admin', function (done) {
        var req = request.get('/api/contestants/' + contestant._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', contestant.name);
                done();
            });
    });


    it('should not be able to update a single contestant if guest', function (done) {
        contestant.name = 'changed';

        agent.put('/api/contestants/' + contestant._id)
            .send(contestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update a single contestant if user', function (done) {
        contestant.name = 'change';

        var req = request.put('/api/contestants/' + contestant._id);
        userAgent.attachCookies(req);
        req.send(contestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update a single contestant if admin', function (done) {
        contestant.name = 'changed';

        var req = request.put('/api/contestants/' + contestant._id);
        adminAgent.attachCookies(req);
        req.send(contestant)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(contestant._id));
                (res.body.name).should.match('changed');
                done();
            });
    });

    it('should not be able to delete an contestant if guest', function (done) {
        agent.delete('/api/contestants/' + contestant._id)
            .send(contestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to delete an contestant if user', function (done) {
        var req = request.delete('/api/contestants/' + contestant._id);
        userAgent.attachCookies(req);
        req.send(contestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });



    it('should be able to delete an contestant if admin', function (done) {
        var req = request.delete('/api/contestants/' + contestant._id);
        adminAgent.attachCookies(req);
        req.send(contestant)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(contestant._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            Contestant.remove().exec(done);
        });
    });

});