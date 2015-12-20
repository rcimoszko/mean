'use strict';

var policy = require('../policies/pinnacle.sports.leagues.server.policies'),
    ctrl = require('../controllers/pinnacle.sports.leagues.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/sports/:pinSportId/leagues').all(policy.isAllowed)
        .get(ctrl.getAll);

};