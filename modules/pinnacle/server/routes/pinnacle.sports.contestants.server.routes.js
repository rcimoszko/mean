'use strict';

var policy = require('../policies/pinnacle.sports.contestants.policy'),
    ctrl = require('../controllers/pinnacle.sports.contestants.server.controller.js');

module.exports = function (app) {

    app.route('/api/pinnacle/sports/:pinSportId/contestants').all(policy.isAllowed)
        .get(ctrl.getAll);

};