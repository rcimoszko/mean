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

describe('/api/contestants/{id}/merge', function () {

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



    it('should not be able to merge contestants if guest', function (done) {
        agent.put('/api/contestants/' + contestant._id + '/merge')
            .send(contestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able to merge contestant if user', function (done) {
        var req = request.put('/api/contestants/' + contestant._id + '/merge');
        userAgent.attachCookies(req);
        req.send(contestant)
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    //'it should be able to merge contestants if admin


    after(function (done) {
        User.remove().exec(function () {
            Contestant.remove().exec(done);
        });
    });

});