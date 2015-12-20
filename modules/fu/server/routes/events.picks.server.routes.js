'use strict';

var policy = require('../policies/events.picks.server.policies'),
    ctrl = require('../controllers/events.picks.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/picks').all(policy.isAllowed)
        .get(ctrl.getAll);

};
