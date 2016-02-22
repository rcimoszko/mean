'use strict';

var policy = require('../policies/events.slug.server.policies'),
    ctrl = require('../controllers/events.slug.server.controller');

module.exports = function (app) {


    app.route('/api/events/slug/:eventSlug').all(policy.isAllowed)
        .get(ctrl.get);

    app.param('eventSlug', ctrl.bySlug);

};