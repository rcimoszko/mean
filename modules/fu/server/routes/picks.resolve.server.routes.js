'use strict';

var policy = require('../policies/picks.resolve.server.policies'),
    ctrl = require('../controllers/picks.resolve.server.controller');

module.exports = function (app) {

    app.route('/api/picks/:pickId/resolve').all(policy.isAllowed)
        .put(ctrl.resolve);

};