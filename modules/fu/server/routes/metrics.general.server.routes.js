'use strict';

var policy = require('../policies/metrics.general.server.policies'),
    ctrl = require('../controllers/metrics.general.server.controller');

module.exports = function (app) {

    app.route('/api/metrics/general').all(policy.isAllowed)
        .get(ctrl.get);

};