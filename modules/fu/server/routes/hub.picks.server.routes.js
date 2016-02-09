'use strict';

var policy = require('../policies/hub.picks.server.policies'),
    ctrl = require('../controllers/hub.picks.server.controller');

module.exports = function (app) {

    app.route('/api/hub/picks').all(policy.isAllowed)
        .get(ctrl.get);

};
