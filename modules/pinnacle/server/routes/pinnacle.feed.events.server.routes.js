'use strict';

var policy = require('../policies/pinnacle.feed.events.server.policies'),
    ctrl = require('../controllers/pinnacle.feed.events.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/feed/events').all(policy.isAllowed)
        .get(ctrl.get);

};