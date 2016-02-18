'use strict';

var policy = require('../policies/picks.comments.server.policies'),
    ctrl = require('../controllers/picks.comments.server.controller');

module.exports = function (app) {

    app.route('/api/picks/:pickId/comments').all(policy.isAllowed)
        .get(ctrl.get)
        .post(ctrl.create);

    app.route('/api/picks/:pickId/comments/:commentId').all(policy.isAllowed)
        .put(ctrl.update);

};