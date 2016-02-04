'use strict';

var policy = require('../policies/trending.server.policies'),
    ctrl = require('../controllers/trending.server.controller');

module.exports = function (app) {

    app.route('/api/trending').all(policy.isAllowed)
        .get(ctrl.get);

};
