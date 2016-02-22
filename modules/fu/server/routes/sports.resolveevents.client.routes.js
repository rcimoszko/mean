'use strict';

var policy = require('../policies/sports.resolveevents.server.policies'),
    ctrl = require('../controllers/sports.resolveevents.server.controller');

module.exports = function (app) {

    app.route('/api/sports/:sportId/resolveevents').all(policy.isAllowed)
        .get(ctrl.get);

};
