'use strict';

var policy = require('../policies/search.users.server.policies'),
    ctrl = require('../controllers/search.users.server.controller');

module.exports = function (app) {

    app.route('/api/search/users').all(policy.isAllowed)
        .get(ctrl.get);

};
