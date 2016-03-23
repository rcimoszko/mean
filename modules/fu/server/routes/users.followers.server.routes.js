'use strict';

var policy = require('../policies/users.followers.server.policies'),
    ctrl = require('../controllers/users.followers.server.controller');

module.exports = function (app) {

    app.route('/api/users/:userId/followers').all(policy.isAllowed)
        .get(ctrl.get);

};