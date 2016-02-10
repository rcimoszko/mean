'use strict';

var policy = require('../policies/comments.previews.server.policies'),
    ctrl = require('../controllers/comments.previews.server.controller');

module.exports = function (app) {

    app.route('/api/comments/previews').all(policy.isAllowed)
        .get(ctrl.get);

};
