'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    m_Comment = mongoose.model('Comment'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, comment;

describe('/api/comments', function () {

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

        function createm_Comment(callback){
            comment = new m_Comment({
                text: 'comment-text'
            });
            comment.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createm_Comment);

        async.waterfall(todo, done);
    });



    it('should not be able get list of comments if guest', function (done) {
        agent.get('/api/comments')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });


    it('should not be able get list of comments if query not provided and user', function (done) {
        var req = request.get('/api/comments');
        userAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of comments if query not provided and admin', function (done) {
        var req = request.get('/api/comments');
        adminAgent.attachCookies(req);
        req.send()
            .expect(400)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able get list of comments if query provided and user', function (done) {
        var req = request.get('/api/comments?text=comment-text');
        userAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    it('should be able get list of comments if query provided and admin', function (done) {
        var req = request.get('/api/comments?text=comment-text');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });


    it('should not be able to get a single comment if guest', function (done) {
        agent.get('/api/comments/' + comment._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to get a single comment if user', function (done) {
        var req = request.get('/api/comments/' + comment._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to get a single comment if admin', function (done) {
        var req = request.get('/api/comments/' + comment._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('text', comment.text);
                done();
            });
    });


    it('should not be able to update a single comment if guest', function (done) {
        comment.text = 'changed';

        agent.put('/api/comments/' + comment._id)
            .send(comment)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update a single comment if user', function (done) {
        comment.text = 'change';

        var req = request.put('/api/comments/' + comment._id);
        userAgent.attachCookies(req);
        req.send(comment)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update a single comment if admin', function (done) {
        comment.text = 'changed';

        var req = request.put('/api/comments/' + comment._id);
        adminAgent.attachCookies(req);
        req.send(comment)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(comment._id));
                (res.body.text).should.match('changed');
                done();
            });
    });

    it('should not be able to delete an comment if guest', function (done) {
        agent.delete('/api/comments/' + comment._id)
            .send(comment)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to delete an comment if user', function (done) {
        var req = request.delete('/api/comments/' + comment._id);
        userAgent.attachCookies(req);
        req.send(comment)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });



    it('should be able to delete an comment if admin', function (done) {
        var req = request.delete('/api/comments/' + comment._id);
        adminAgent.attachCookies(req);
        req.send(comment)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(comment._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            m_Comment.remove().exec(done);
        });
    });

});