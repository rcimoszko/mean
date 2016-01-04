'use strict';

var policy = require('../policies/leagues.contestants.server.policies'),
    ctrl = require('../controllers/leagues.contestants.server.controller');

module.exports = function (app) {

    app.route('/api/leagues/:leagueId/contestants').all(policy.isAllowed)
        .get(ctrl.get);

};