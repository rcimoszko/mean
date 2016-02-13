'use strict';

var policy = require('../policies/leagues.server.policies'),
    ctrl = require('../controllers/leagues.server.controller');

module.exports = function (app) {

    app.route('/api/leagues').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/leagues/:leagueId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('leagueId', ctrl.byId);
    app.param('leagueSlug', ctrl.bySlug);

};