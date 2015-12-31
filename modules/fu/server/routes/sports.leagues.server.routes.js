'use strict';

var policy = require('../policies/sports.leagues.server.policies'),
    ctrl = require('../controllers/sports.leagues.server.controller');

module.exports = function (app) {

    app.route('/api/sports/:sportId/leagues').all(policy.isAllowed)
        .get(ctrl.get);

};
