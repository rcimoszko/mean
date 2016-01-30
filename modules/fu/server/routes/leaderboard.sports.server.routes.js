'use strict';

var policy = require('../policies/leaderboard.sports.server.policies'),
    ctrl = require('../controllers/leaderboard.sports.server.controller');

module.exports = function (app) {

    app.route('/api/leaderboard/sports').all(policy.isAllowed)
        .get(ctrl.get);

};
