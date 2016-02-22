'use strict';

var policy = require('../policies/sports.resolvelist.server.policies'),
    ctrl = require('../controllers/sports.resolvelist.server.controller');

module.exports = function (app) {

    app.route('/api/sports/resolvelist').all(policy.isAllowed)
        .get(ctrl.get);

};
