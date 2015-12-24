'use strict';

var policy = require('../policies/discover.server.policies'),
    ctrl = require('../controllers/discover.server.controller');

module.exports = function (app) {

    app.route('/api/discover').all(policy.isAllowed)
        .get(ctrl.get);

};