'use strict';

var policy = require('../policies/user.following.settings.server.policies'),
    ctrl = require('../controllers/user.following.settings.server.controller');

module.exports = function (app) {

    app.route('/api/user/following/settings').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/user/following/settings/:followId').all(policy.isAllowed)
        .put(ctrl.update);

    app.param('followId', ctrl.byId);
};
