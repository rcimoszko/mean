'use strict';

var policy = require('../policies/groups.server.policies'),
    ctrl = require('../controllers/groups.server.controller');

module.exports = function (app) {

    app.route('/api/groups').all(policy.isAllowed)
        .post(ctrl.create)
        .get(ctrl.getAll);

    app.route('/api/groups/:groupId').all(policy.isAllowed)
        .get(ctrl.get)
        .put(ctrl.update)
        .delete(ctrl.delete);

    app.param('groupId', ctrl.byId);

};