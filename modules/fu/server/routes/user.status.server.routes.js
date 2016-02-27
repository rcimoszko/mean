'use strict';

var policy = require('../policies/user.status.server.policies'),
    ctrl = require('../controllers/user.status.server.controller');

module.exports = function (app) {

    app.route('/api/user/status').all(policy.isAllowed)
        .get(ctrl.get);

};
