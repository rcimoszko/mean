'use strict';

var policy = require('../policies/conversations.server.policies'),
    ctrl = require('../controllers/conversations.server.controller');

module.exports = function (app) {

    app.route('/api/conversations/:conversationId').all(policy.isAllowed)
        .get(ctrl.get);

    app.param('conversationId', ctrl.byId);

};