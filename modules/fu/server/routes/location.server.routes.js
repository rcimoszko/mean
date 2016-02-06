'use strict';

var policy = require('../policies/location.server.policies'),
    ctrl = require('../controllers/location.server.controller');

module.exports = function (app) {

    app.route('/api/location').all(policy.isAllowed)
        .get(ctrl.get);

};