'use strict';

var policy = require('../policies/pinnacle.policy'),
    ctrl = require('../controllers/pinnacle.sports.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/sports').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/pinnacle/sports/:sportId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update);

    app.param('pinLeagueId', ctrl.byId);

};