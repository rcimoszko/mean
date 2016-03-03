'use strict';

var policy = require('../policies/user.share.server.policies'),
    ctrl = require('../controllers/user.share.server.controller');

module.exports = function (app) {

    app.route('/api/user/share').all(policy.isAllowed)
        .post(ctrl.share);

};
