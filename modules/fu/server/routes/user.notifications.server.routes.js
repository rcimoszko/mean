'use strict';

var policy = require('../policies/user.notifications.server.policies'),
    ctrl = require('../controllers/user.notifications.server.controller');

module.exports = function (app) {

    app.route('/api/user/notifications').all(policy.isAllowed)
        .get(ctrl.get);

};
