'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    PinnacleContestant = mongoose.model('PinnacleContestant'),
    PinnacleLeague = mongoose.model('PinnacleLeague'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, pinnacleLeague, pinnacleContestant;

describe('/api/pinnacle/leagues/{leagueId}/contestants', function () {

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
            function cb(err){
                callback(err, pinnacleLeague);
            }
            pinnacleLeague.save(cb);
        }

        function createPinnacleContestant(pinnacleLeague, callback){

            pinnacleContestant = new PinnacleContestant({
                name: 'Pinnacle Contestant Name',
                pinnacleLeague: {name: pinnacleLeague.name, ref: pinnacleLeague._id}
            });

            pinnacleContestant.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createPinnacleLeague);
        todo.push(createPinnacleContestant);

        async.waterfall(todo, done);
    });

    it('should not be able get list of pinnacle contestants if guest', function (done) {
        agent.get('/api/pinnacle/leagues/'+pinnacleLeague._id+'/contestants')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of pinnacle contestants if user', function (done) {
        var req = request.get('/api/pinnacle/leagues/'+pinnacleLeague._id+'/contestants');
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able get list of pinnacle contestants if admin', function (done) {
        var req = request.get('/api/pinnacle/leagues/'+pinnacleLeague._id+'/contestants');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    after(function (done) {
        User.remove().exec(function () {
            PinnacleLeague.remove().exec(function(){
                PinnacleContestant.remove().exec(done);
            });
        });
    });

});