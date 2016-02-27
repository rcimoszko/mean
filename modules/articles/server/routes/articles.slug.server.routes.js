'use strict';

var policy = require('../policies/articles.slug.server.policy'),
    ctrl = require('../controllers/articles.slug.server.controller');

module.exports = function (app) {
    app.route('/api/articles/slug/:articleSlug').all(policy.isAllowed)
        .get(ctrl.get);

};