'use strict';

var policy = require('../policies/propicks.all.server.policies'),
    ctrl = require('../controllers/propicks.all.server.controller');

module.exports = function (app) {

    app.route('/api/propicks/all').all(policy.isAllowed)
        .get(ctrl.get);

};
