'use strict';

var policy = require('../policies/hub.server.policies'),
    ctrl = require('../controllers/hub.server.controller');

module.exports = function (app) {

    app.route('/api/hub').all(policy.isAllowed)
        .get(ctrl.get);

};
