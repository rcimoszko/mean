'use strict';

var policy = require('../policies/makepicks.server.policies'),
    ctrl = require('../controllers/makepicks.server.controller');

module.exports = function (app) {

    app.route('/api/makepicks').all(policy.isAllowed)
        .get(ctrl.get);

};