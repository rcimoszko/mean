'use strict';

var policy = require('../policies/pinnacle.leagues.policy'),
    ctrl = require('../controllers/pinnacle.leagues.server.controller.js');

module.exports = function (app) {

    app.route('/api/pinnacle/leagues/:pinLeagueId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update);

    app.param('pinLeagueId', ctrl.byId);

};