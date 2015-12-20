'use strict';

var policy = require('../policies/events.report.server.policies'),
    ctrl = require('../controllers/events.report.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/report').all(policy.isAllowed)
        .post(ctrl.report);

};