'use strict';

var policy = require('../policies/users.profile.server.policies'),
    ctrl = require('../controllers/users.profile.server.controller');

module.exports = function (app) {

    app.route('/api/users/:username/profile').all(policy.isAllowed)
        .get(ctrl.get);

};