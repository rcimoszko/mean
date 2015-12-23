'use strict';

var policy = require('../policies/channels.server.policies'),
    ctrl = require('../controllers/channels.server.controller');

module.exports = function (app) {

    app.route('/api/channels').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/channels/:channelId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('channelId', ctrl.byId);

};