'use strict';

var policy = require('../policies/pinnacle.contestants.policy'),
    ctrl = require('../controllers/pinnacle.contestants.server.controller');

module.exports = function (app) {

    app.route('/api/pinnacle/contestants/:pinContestantId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update);

    app.param('pinContestantId', ctrl.byId);

};