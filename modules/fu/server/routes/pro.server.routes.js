'use strict';

var policy = require('../policies/pro.server.policies'),
    ctrl = require('../controllers/pro.server.controller');

module.exports = function (app) {
    app.route('/pro/new').all(policy.isAllowed).post(ctrl.newPro);
    app.route('/pro/change').all(policy.isAllowed).post(ctrl.change);
    app.route('/pro/cancel').all(policy.isAllowed).get(ctrl.cancel);
    app.route('/pro/resume').all(policy.isAllowed).get(ctrl.resume);

};

