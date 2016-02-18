'use strict';

var policy = require('../policies/user.conversations.server.policies'),
    ctrl = require('../controllers/user.conversations.server.controller');

module.exports = function (app) {

    app.route('/api/user/conversations').all(policy.isAllowed)
        .get(ctrl.get)
        .post(ctrl.create);

};