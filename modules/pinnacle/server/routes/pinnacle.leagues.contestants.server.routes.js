'use strict';

var policy = require('../policies/pinnacle.leagues.contestants.server.policies'),
    ctrl = require('../controllers/pinnacle.leagues.contestants.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/leagues/:pinLeagueId/contestants').all(policy.isAllowed)
        .get(ctrl.getAll);

};