'use strict';

var policy = require('../policies/propicks.sport.totals.server.policies'),
    ctrl = require('../controllers/propicks.sport.totals.server.controller');

module.exports = function (app) {

    app.route('/api/propicks/sport/totals').all(policy.isAllowed)
        .get(ctrl.get);

};
