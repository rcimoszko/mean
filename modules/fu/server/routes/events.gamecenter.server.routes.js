'use strict';

var policy = require('../policies/events.gamecenter.server.policies'),
    ctrl = require('../controllers/events.gamecenter.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/gamecenter').all(policy.isAllowed)
        .get(ctrl.get);

};
