'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    m_Event = mongoose.model('Event'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, m_event;

describe('/api/events', function () {

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

        function createEvent(callback){
            m_event = new m_Event({
                slug: 'event-slug'
            });
            m_event.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createEvent);

        async.waterfall(todo, done);
    });

    /*

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
    */


    it('should not be able to get a single event if guest', function (done) {
        agent.get('/api/events/' + m_event._id)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to get a single event if user', function (done) {
        var req = request.get('/api/events/' + m_event._id);
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to get a single event if admin', function (done) {
        var req = request.get('/api/events/' + m_event._id);
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Object).and.have.property('slug', m_event.slug);
                done();
            });
    });


    it('should not be able to update a single event if guest', function (done) {
        m_event.slug = 'changed';

        agent.put('/api/events/' + m_event._id)
            .send(m_event)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to update a single event if user', function (done) {
        m_event.slug = 'change';

        var req = request.put('/api/events/' + m_event._id);
        userAgent.attachCookies(req);
        req.send(m_event)
            .send(m_event)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to update a single event if admin', function (done) {
        m_event.slug = 'changed';

        var req = request.put('/api/events/' + m_event._id);
        adminAgent.attachCookies(req);
        req.send(m_event)
            .send(m_event)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(m_event._id));
                (res.body.slug).should.match('changed');
                done();
            });
    });

    it('should not be able to delete an event if guest', function (done) {
        agent.delete('/api/events/' + m_event._id)
            .send(m_event)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to delete an event if user', function (done) {
        var req = request.delete('/api/events/' + m_event._id);
        userAgent.attachCookies(req);
        req.send(m_event)
            .send(m_event)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });



    it('should be able to delete an event if admin', function (done) {
        var req = request.delete('/api/events/' + m_event._id);
        adminAgent.attachCookies(req);
        req.send(m_event)
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(m_event._id));
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            m_Event.remove().exec(done);
        });
    });

});