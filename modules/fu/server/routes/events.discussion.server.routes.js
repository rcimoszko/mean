'use strict';

var policy = require('../policies/events.discussion.server.policies'),
    ctrl = require('../controllers/events.discussion.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/discussion').all(policy.isAllowed)
        .get(ctrl.getAll);

};
