'use strict';

var policy = require('../policies/propicks.league.totals.server.policies'),
    ctrl = require('../controllers/propicks.league.totals.server.controller');

module.exports = function (app) {

    app.route('/api/propicks/league/totals').all(policy.isAllowed)
        .get(ctrl.get);

};
