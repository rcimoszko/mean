'use strict';

var policy = require('../policies/pinnacle.feed.leagues.server.policies'),
    ctrl = require('../controllers/pinnacle.feed.leagues.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/feed/leagues').all(policy.isAllowed)
        .get(ctrl.get);

};