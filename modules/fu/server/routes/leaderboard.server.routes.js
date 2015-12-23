'use strict';

var policy = require('../policies/leaderboard.server.policies'),
    ctrl = require('../controllers/leaderboard.server.controller');

module.exports = function (app) {

    app.route('/api/leaderboard').all(policy.isAllowed)
        .get(ctrl.get);

};
