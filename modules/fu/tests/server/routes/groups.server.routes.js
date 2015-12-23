'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Group = mongoose.model('Group'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, group;

describe('/api/groups', function () {

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

        function createGroup(callback){
            group = new Group({
                name: 'group name'
            });
            group.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createGroup);

        async.waterfall(todo, done);
    });



    it('should not be able get list of groups if guest', function (done) {
        agent.get('/api/groups')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of groups if query not provided and user', function (done) {
        var req = request.get('/api/groups');
        userAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of groups if query not provided and admin', function (done) {
        var req = request.get('/api/groups');
        adminAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });


    it('should be able get list of groups if query provided and user', function (done) {
        var req = request.get('/api/groups?name=group name');
        userAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    it('should be able get list of groups if query provided and admin', function (done) {
        var req = request.get('/api/groups?name=group name');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });


    it('should not be able to get a single group if guest', function (done) {
        agent.get('/api/groups/' + group._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to get a single group if user', function (done) {
        var req = request.get('/api/groups/' + group._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to get a single group if admin', function (done) {
        var req = request.get('/api/groups/' + group._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('name', group.name);
                done();
            });
    });


    it('should not be able to update a single group if guest', function (done) {
        group.name = 'changed';

        agent.put('/api/groups/' + group._id)
            .send(group)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update a single group if user', function (done) {
        group.name = 'change';

        var req = request.put('/api/groups/' + group._id);
        userAgent.attachCookies(req);
        req.send(group)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update a single group if admin', function (done) {
        group.name = 'changed';

        var req = request.put('/api/groups/' + group._id);
        adminAgent.attachCookies(req);
        req.send(group)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(group._id));
                (res.body.name).should.match('changed');
                done();
            });
    });


    it('should not be able to delete a group if guest', function (done) {
        agent.delete('/api/groups/' + group._id)
            .send(group)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to delete a group if user', function (done) {
        var req = request.delete('/api/groups/' + group._id);
        userAgent.attachCookies(req);
        req.send(group)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to delete a group if admin', function (done) {
        var req = request.delete('/api/groups/' + group._id);
        adminAgent.attachCookies(req);
        req.send(group)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(group._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            Group.remove().exec(done);
        });
    });

});
