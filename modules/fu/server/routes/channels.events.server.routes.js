'use strict';

var policy = require('../policies/channels.events.server.policies'),
    ctrl = require('../controllers/channels.events.server.controller');

module.exports = function (app) {

    app.route('/api/channels/:channelSlug/events').all(policy.isAllowed)
        .get(ctrl.get);

};
