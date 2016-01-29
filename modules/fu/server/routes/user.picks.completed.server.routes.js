'use strict';

var policy = require('../policies/user.picks.completed.server.policies'),
    ctrl = require('../controllers/user.picks.completed.server.controller');

module.exports = function (app) {

    app.route('/api/user/picks/completed').all(policy.isAllowed)
        .get(ctrl.get);

};
