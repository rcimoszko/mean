'use strict';

var policy = require('../policies/pinnacle.feed.odds.server.policies'),
    ctrl = require('../controllers/pinnacle.feed.odds.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/feed/odds').all(policy.isAllowed)
        .get(ctrl.get);

};