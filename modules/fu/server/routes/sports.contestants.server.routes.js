'use strict';

var policy = require('../policies/sports.contestants.server.policies'),
    ctrl = require('../controllers/sports.contestants.server.controller');

module.exports = function (app) {

    app.route('/api/sports/:sportId/contestants').all(policy.isAllowed)
        .get(ctrl.get);

};
