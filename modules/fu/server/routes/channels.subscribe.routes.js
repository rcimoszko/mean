'use strict';

var policy = require('../policies/channels.subscribe.server.policies'),
    ctrl = require('../controllers/channels.subscribe.server.controller');

module.exports = function (app) {

    app.route('/api/channels/:channelId/subscribe').all(policy.isAllowed)
        .post(ctrl.subscribe);

};
