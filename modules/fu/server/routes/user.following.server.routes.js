'use strict';

var policy = require('../policies/user.following.server.policies'),
    ctrl = require('../controllers/user.following.server.controller');

module.exports = function (app) {

    app.route('/api/user/following').all(policy.isAllowed)
        .get(ctrl.get);

};
