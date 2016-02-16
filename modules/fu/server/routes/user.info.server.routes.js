'use strict';

var policy = require('../policies/user.info.server.policies'),
    ctrl = require('../controllers/user.info.server.controller');

module.exports = function (app) {

    app.route('/api/user/info').all(policy.isAllowed)
        .get(ctrl.get);

};
