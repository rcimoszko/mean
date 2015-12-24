'use strict';

var policy = require('../policies/user.picks.server.policies'),
    ctrl = require('../controllers/user.picks.server.controller');

module.exports = function (app) {

    app.route('/api/user/picks').all(policy.isAllowed)
        .get(ctrl.get);

};
