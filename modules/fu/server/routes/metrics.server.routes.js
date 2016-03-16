'use strict';

var policy = require('../policies/metrics.server.policies'),
    ctrl = require('../controllers/metrics.server.controller');

module.exports = function (app) {

    app.route('/api/metrics').all(policy.isAllowed)
        .get(ctrl.get);

};