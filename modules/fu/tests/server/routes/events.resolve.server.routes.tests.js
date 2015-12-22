'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    m_Event = mongoose.model('Event'),
    Pick = mongoose.model('Pick'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, m_event;

describe('/api/events/{id}/resolve', function () {

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



    it('should not be able to resolve event if guest', function (done) {
        agent.put('/api/events/' + m_event._id + '/resolve')
            .send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to resolve event if user', function (done) {
        var req = request.put('/api/events/' + m_event._id + '/resolve');
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able to resolve event if admin', function (done) {
        var req = request.put('/api/events/' + m_event._id + '/resolve');
        adminAgent.attachCookies(req);
        req.send()
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);
                (res.body._id).should.equal(String(m_event._id));
                (res.body.over).should.match(true);
                done();
            });
    });


    after(function (done) {
        User.remove().exec(function () {
            m_Event.remove().exec(done);
        });
    });

});