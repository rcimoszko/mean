'use strict';

var policy = require('../policies/pinnacle.sports.policy'),
    ctrl = require('../controllers/pinnacle.sports.server.controller.js');

module.exports = function (app) {

    app.route('/api/pinnacle/sports').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/pinnacle/sports/:pinSportId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update);

    app.param('pinSportId', ctrl.byId);

};