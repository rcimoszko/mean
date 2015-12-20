'use strict';

var policy = require('../policies/events.resolve.server.policies'),
    ctrl = require('../controllers/events.resolve.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/resolve').all(policy.isAllowed)
        .post(ctrl.resolve);

};