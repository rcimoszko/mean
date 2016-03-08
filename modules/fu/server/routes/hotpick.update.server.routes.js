'use strict';

var policy = require('../policies/hotpick.update.server.policies'),
    ctrl = require('../controllers/hotpick.update.server.controller');

module.exports = function (app) {

    app.route('/api/hotpick/update').all(policy.isAllowed)
        .get(ctrl.get);

};