'use strict';

var policy = require('../policies/leaderboard.leagues.server.policies'),
    ctrl = require('../controllers/leaderboard.leagues.server.controller');

module.exports = function (app) {

    app.route('/api/leaderboard/leagues/:sportId').all(policy.isAllowed)
        .get(ctrl.get);

};
