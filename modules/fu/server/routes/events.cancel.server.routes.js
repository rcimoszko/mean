'use strict';

var policy = require('../policies/events.cancel.server.policies'),
    ctrl = require('../controllers/events.cancel.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/cancel').all(policy.isAllowed)
        .put(ctrl.cancel);

};
