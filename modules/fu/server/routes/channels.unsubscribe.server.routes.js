'use strict';

var policy = require('../policies/channels.unsubscribe.server.policies'),
    ctrl = require('../controllers/channels.unsubscribe.server.controller');

module.exports = function (app) {

    app.route('/api/channels/:channelId/unsubscribe').all(policy.isAllowed)
        .post(ctrl.unsubscribe);

};
