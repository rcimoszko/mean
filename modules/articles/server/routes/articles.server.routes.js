'use strict';

var policy = require('../policies/articles.server.policy'),
    ctrl = require('../controllers/articles.server.controller');

module.exports = function (app) {
    app.route('/api/articles').all(policy.isAllowed)
        .get(ctrl.getAll)
        .post(ctrl.create);

    app.route('/api/articles/:articleId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('articleId', ctrl.byId);
    app.param('articleSlug', ctrl.bySlug);
};