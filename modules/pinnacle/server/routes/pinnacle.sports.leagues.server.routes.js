'use strict';

var policy = require('../policies/pinnacle.sports.leagues.policy'),
    ctrl = require('../controllers/pinnacle.sports.leagues.server.controller.js');

module.exports = function (app) {

    app.route('/api/pinnacle/sports/:pinSportId/leagues').all(policy.isAllowed)
        .get(ctrl.getAll);

};