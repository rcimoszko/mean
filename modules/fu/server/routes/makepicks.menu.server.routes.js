'use strict';

var policy = require('../policies/makepicks.menu.server.policies'),
    ctrl = require('../controllers/makepicks.menu.server.controller');

module.exports = function (app) {

    app.route('/api/makepicks/menu').all(policy.isAllowed)
        .get(ctrl.get);

};