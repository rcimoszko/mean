'use strict';

var policy = require('../policies/leaderboard.contestants.server.policies'),
    ctrl = require('../controllers/leaderboard.contestants.server.controller');

module.exports = function (app) {

    app.route('/api/leaderboard/contestants').all(policy.isAllowed)
        .get(ctrl.get);

};
