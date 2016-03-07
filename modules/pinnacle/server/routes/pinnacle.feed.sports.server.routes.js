'use strict';

var policy = require('../policies/pinnacle.feed.sports.server.policies'),
    ctrl = require('../controllers/pinnacle.feed.sports.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/feed/sports').all(policy.isAllowed)
        .get(ctrl.get);

};