'use strict';

var policy = require('../policies/sports.server.policies'),
    ctrl = require('../controllers/sports.server.controller');

module.exports = function (app) {

    app.route('/api/sports').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/sports/:sportId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('sportId', ctrl.byId);
    app.param('sportSlug', ctrl.bySlug);

};