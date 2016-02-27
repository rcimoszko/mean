'use strict';

var policy = require('../policies/verify.server.policies'),
    ctrl = require('../controllers/verify.server.controller');

module.exports = function (app) {

    app.route('/verify/:token').all(policy.isAllowed)
        .get(ctrl.verify);

};