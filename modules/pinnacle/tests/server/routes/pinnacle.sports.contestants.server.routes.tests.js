'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    PinnacleContestant = mongoose.model('PinnacleContestant'),
    PinnacleSport = mongoose.model('PinnacleSport'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, pinnacleSport, pinnacleContestant;

describe('/api/pinnacle/sports/{sportId}/contestants', function () {

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

        function createPinnacleSport(callback){
            pinnacleSport = new PinnacleSport({
                name: 'Pinnacle Sport Name'
            });
            function cb(err){
                callback(err, pinnacleSport);
            }
            pinnacleSport.save(cb);
        }

        function createPinnacleContestant(pinnacleSport, callback){

            pinnacleContestant = new PinnacleContestant({
                name: 'Pinnacle Contestant Name',
                pinnacleSport: {name: pinnacleSport.name, ref: pinnacleSport._id}
            });

            pinnacleContestant.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createPinnacleSport);
        todo.push(createPinnacleContestant);

        async.waterfall(todo, done);
    });

    it('should not be able get list of pinnacle contestants if guest', function (done) {
        agent.get('/api/pinnacle/sports/'+pinnacleSport._id+'/contestants')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of pinnacle contestants if user', function (done) {
        var req = request.get('/api/pinnacle/sports/'+pinnacleSport._id+'/contestants');
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able get list of pinnacle contestants if admin', function (done) {
        var req = request.get('/api/pinnacle/sports/'+pinnacleSport._id+'/contestants');
        adminAgent.attachCookies(req);
        req.send()
            .end(function (req, res) {
                res.body.should.be.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });

    after(function (done) {
        User.remove().exec(function () {
            PinnacleSport.remove().exec(function(){
                PinnacleContestant.remove().exec(done);
            });
        });
    });

});