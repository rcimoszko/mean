'use strict';

var policy = require('../policies/comments.server.policies'),
    ctrl = require('../controllers/comments.server.controller');

module.exports = function (app) {

    app.route('/api/comments').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/comments/:commentId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('commentId', ctrl.byId);

};