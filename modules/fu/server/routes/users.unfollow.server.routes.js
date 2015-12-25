'use strict';

var policy = require('../policies/users.unfollow.server.policies'),
    ctrl = require('../controllers/users.unfollow.server.controller');

module.exports = function (app) {

    app.route('/api/users/:userId/unfollow').all(policy.isAllowed)
        .post(ctrl.unfollow);

};