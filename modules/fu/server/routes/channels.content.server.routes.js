'use strict';

var policy = require('../policies/channels.content.server.policies'),
    ctrl = require('../controllers/channels.content.server.controller');

module.exports = function (app) {

    app.route('/api/channels/:channelSlug/content').all(policy.isAllowed)
        .get(ctrl.get);

};