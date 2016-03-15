'use strict';

var policy = require('../policies/users.new.server.policies'),
    ctrl = require('../controllers/users.new.server.controller');

module.exports = function (app) {

    app.route('/api/users/new').all(policy.isAllowed)
        .get(ctrl.get);
};
