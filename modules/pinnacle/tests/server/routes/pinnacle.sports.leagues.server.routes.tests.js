'use strict';
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    PinnacleLeague = mongoose.model('PinnacleLeague'),
    PinnacleSport = mongoose.model('PinnacleSport'),
    userHelper = require('../user.helper.js'),

    supertest = require('supertest'),
    app = 'http://127.0.0.1:3001',
    agent = supertest.agent(app),
    request = supertest(app);


var userAgent, adminAgent, credentials, user, admin, pinnacleSport, pinnacleLeague;

describe('/api/pinnacle/sports/{sportId}/leagues', function () {

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

        function createPinnacleLeague(pinnacleSport, callback){

            pinnacleLeague = new PinnacleLeague({
                name: 'Pinnacle League Name',
                pinnacleSport: {name: pinnacleSport.name, ref: pinnacleSport._id}
            });

            pinnacleLeague.save(callback);
        }

        todo.push(signInUser);
        todo.push(signInAdmin);
        todo.push(createPinnacleSport);
        todo.push(createPinnacleLeague);

        async.waterfall(todo, done);
    });

    it('should not be able get list of pinnacle leagues if guest', function (done) {
        agent.get('/api/pinnacle/sports/'+pinnacleSport._id+'/leagues')
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should not be able get list of pinnacle leagues if user', function (done) {
        var req = request.get('/api/pinnacle/sports/'+pinnacleSport._id+'/leagues');
        userAgent.attachCookies(req);
        req.send()
            .expect(403)
            .end(function (err) {
                done(err);
            });
    });

    it('should be able get list of pinnacle leagues if admin', function (done) {
        var req = request.get('/api/pinnacle/sports/'+pinnacleSport._id+'/leagues');
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
                PinnacleLeague.remove().exec(done);
            });
        });
    });

});