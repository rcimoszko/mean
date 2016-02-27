'use strict';

var policy = require('../policies/verification.send.server.policies'),
    ctrl = require('../controllers/verification.send.server.controller');

module.exports = function (app) {

    app.route('/api/verification/send').all(policy.isAllowed)
        .post(ctrl.send);

};