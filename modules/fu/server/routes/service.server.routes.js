'use strict';

var policy = require('../policies/service.server.policies'),
    ctrl = require('../controllers/service.server.controller');

module.exports = function (app) {

    app.route('/api/service/feed').all(policy.isAllowed)
        .get(ctrl.getFeed);
    /*
    app.route('/api/service/resolve').all(policy.isAllowed)
        .get(ctrl.getResolve);
        */

};
