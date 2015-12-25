'use strict';

var policy = require('../policies/search.server.policies'),
    ctrl = require('../controllers/search.server.controller');

module.exports = function (app) {

    app.route('/api/search').all(policy.isAllowed)
        .get(ctrl.get);

};
