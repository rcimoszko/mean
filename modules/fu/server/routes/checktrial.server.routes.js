'use strict';

var policy = require('../policies/checktrial.server.policies'),
    ctrl = require('../controllers/checktrial.server.controller');

module.exports = function (app) {

    app.route('/api/checktrial').all(policy.isAllowed)
        .get(ctrl.get);

};
