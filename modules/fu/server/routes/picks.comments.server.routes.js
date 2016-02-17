'use strict';

var policy = require('../policies/picks.comments.server.policies'),
    ctrl = require('../controllers/picks.comments.server.controller');

module.exports = function (app) {

    app.route('/api/picks/:pickId/comments').all(policy.isAllowed)
        .get(ctrl.get);

};