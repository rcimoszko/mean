'use strict';

var policy = require('../policies/user.picks.pending.server.policies'),
    ctrl = require('../controllers/user.picks.pending.server.controller');

module.exports = function (app) {

    app.route('/api/user/picks/pending').all(policy.isAllowed)
        .get(ctrl.get);

};
