'use strict';

var policy = require('../policies/picks.report.server.policies'),
    ctrl = require('../controllers/picks.report.server.controller');

module.exports = function (app) {

    app.route('/api/picks/:pickId/report').all(policy.isAllowed)
        .put(ctrl.report);

};