'use strict';

var policy = require('../policies/picks.server.policies'),
    ctrl = require('../controllers/picks.server.controller');

module.exports = function (app) {

    app.route('/api/picks').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/picks/:pickId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.route('/api/picks/:pickSlug').all(policy.isAllowed)
        .get(ctrl.get);

    app.param('pickId', ctrl.byId);
    app.param('pickSlug', ctrl.bySlug);

};