'use strict';

var policy = require('../policies/metrics.engagement.server.policies'),
    ctrl = require('../controllers/metrics.engagement.server.controller');

module.exports = function (app) {

    app.route('/api/metrics/engagement').all(policy.isAllowed)
        .get(ctrl.get);

};