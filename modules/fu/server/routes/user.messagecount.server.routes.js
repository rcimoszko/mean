'use strict';

var policy = require('../policies/user.messagecount.server.policies'),
    ctrl = require('../controllers/user.messagecount.server.controller');

module.exports = function (app) {

    app.route('/api/user/messagecount').all(policy.isAllowed)
        .get(ctrl.get);

};
