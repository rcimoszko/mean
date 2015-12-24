'use strict';

var policy = require('../policies/user.messages.server.policies'),
    ctrl = require('../controllers/user.messages.server.controller');

module.exports = function (app) {

    app.route('/api/user/messages').all(policy.isAllowed)
        .get(ctrl.get);

};
