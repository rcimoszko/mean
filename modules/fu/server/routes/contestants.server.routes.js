'use strict';

var policy = require('../policies/contestants.server.policies'),
    ctrl = require('../controllers/contestants.server.controller');

module.exports = function (app) {

    app.route('/api/contestants').all(policy.isAllowed)
        .get(ctrl.getAll);

    app.route('/api/contestants/:contestantId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('contestantId', ctrl.byId);

};