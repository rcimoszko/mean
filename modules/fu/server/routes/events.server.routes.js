'use strict';

var policy = require('../policies/events.server.policies'),
    ctrl = require('../controllers/events.server.controller');

module.exports = function (app) {

    app.route('/api/events').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/events/:eventId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('eventId', ctrl.byId);

};