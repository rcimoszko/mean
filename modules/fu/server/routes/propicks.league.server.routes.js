'use strict';

var policy = require('../policies/propicks.league.server.policies'),
    ctrl = require('../controllers/propicks.league.server.controller');

module.exports = function (app) {

    app.route('/api/propicks/league').all(policy.isAllowed)
        .get(ctrl.get);

};
