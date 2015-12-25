'use strict';

var policy = require('../policies/users.follow.server.policies'),
    ctrl = require('../controllers/users.follow.server.controller');

module.exports = function (app) {

    app.route('/api/users/:userId/follow').all(policy.isAllowed)
        .post(ctrl.follow);

};