'use strict';

var policy = require('../policies/users.server.policies'),
    ctrl = require('../controllers/users.server.controller');

module.exports = function (app) {

    app.route('/api/users').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.param('username', ctrl.byUsername);
};
