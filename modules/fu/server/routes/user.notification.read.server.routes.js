'use strict';

var policy = require('../policies/user.notifications.read.server.policies'),
    ctrl = require('../controllers/user.notifications.read.server.controller');

module.exports = function (app) {

    app.route('/api/user/notifications/:notificationId/read').all(policy.isAllowed)
        .put(ctrl.read);

};
