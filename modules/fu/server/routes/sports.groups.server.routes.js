'use strict';

var policy = require('../policies/sports.groups.server.policies'),
    ctrl = require('../controllers/sports.groups.server.controller');

module.exports = function (app) {

    app.route('/api/sports/:sportId/groups').all(policy.isAllowed)
        .get(ctrl.get);

};
