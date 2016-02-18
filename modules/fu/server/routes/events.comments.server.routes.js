'use strict';

var policy = require('../policies/events.comments.server.policies'),
    ctrl = require('../controllers/events.comments.server.controller');

module.exports = function (app) {

    app.route('/api/events/:eventId/comments').all(policy.isAllowed)
        .get(ctrl.get)
        .post(ctrl.create);

    app.route('/api/events/:eventId/comments/:commentId').all(policy.isAllowed)
        .put(ctrl.update);

};