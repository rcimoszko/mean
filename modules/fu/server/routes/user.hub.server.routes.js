'use strict';

var policy = require('../policies/user.hub.server.policies'),
    ctrl = require('../controllers/user.hub.server.controller');

module.exports = function (app) {

    app.route('/api/user/hub').all(policy.isAllowed)
        .get(ctrl.get);

};
