'use strict';

var policy = require('../policies/user.tracker.server.policies'),
    ctrl = require('../controllers/user.tracker.server.controller');

module.exports = function (app) {

    app.route('/api/user/tracker').all(policy.isAllowed)
        .get(ctrl.get);

};
