'use strict';

var policy = require('../policies/pinnacle.sports.leagues.contestants.policy'),
    ctrl = require('../controllers/pinnacle.sports.leagues.contestants.server.controller.js');

module.exports = function (app) {

    app.route('/api/pinnacle/sports/:pinSportId/leagues/:pinLeagueId/contestants').all(policy.isAllowed)
        .get(ctrl.getAll);

};