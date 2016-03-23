'use strict';

var policy = require('../policies/users.following.server.policies'),
    ctrl = require('../controllers/users.following.server.controller');

module.exports = function (app) {

    app.route('/api/users/:userId/following').all(policy.isAllowed)
        .get(ctrl.get);

};