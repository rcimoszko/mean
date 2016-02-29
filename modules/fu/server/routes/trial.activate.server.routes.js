'use strict';

var policy = require('../policies/trial.activate.server.policies'),
    ctrl = require('../controllers/trial.activate.server.controller');

module.exports = function (app) {

    app.route('/api/trial/activate').all(policy.isAllowed)
        .get(ctrl.get);

};
