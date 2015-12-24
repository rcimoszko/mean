'use strict';

var policy = require('../policies/profile.server.policies'),
    ctrl = require('../controllers/profile.server.controller');

module.exports = function (app) {

    app.route('/api/profile/:username').all(policy.isAllowed)
        .get(ctrl.get);

};
