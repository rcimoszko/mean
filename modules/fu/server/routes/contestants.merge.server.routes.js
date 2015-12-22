'use strict';

var policy = require('../policies/contestants.merge.server.policies'),
    ctrl = require('../controllers/contestants.merge.server.controller');

module.exports = function (app) {

    app.route('/api/contestants/:contestantId/merge').all(policy.isAllowed)
        .put(ctrl.merge);

};
