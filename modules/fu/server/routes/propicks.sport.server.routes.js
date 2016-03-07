'use strict';

var policy = require('../policies/propicks.sport.server.policies'),
    ctrl = require('../controllers/propicks.sport.server.controller');

module.exports = function (app) {

    app.route('/api/propicks/sport').all(policy.isAllowed)
        .get(ctrl.get);

};
