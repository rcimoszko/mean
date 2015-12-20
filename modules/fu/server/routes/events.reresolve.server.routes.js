'use strict';

var policy = require('../policies/events.reresolve.server.policies'),
    ctrl = require('../controllers/events.reresolve.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/reresolve').all(policy.isAllowed)
        .post(ctrl.reResolve);

};