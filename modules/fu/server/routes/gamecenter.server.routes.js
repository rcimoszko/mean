'use strict';

var policy = require('../policies/gamecenter.server.policies'),
    ctrl = require('../controllers/gamecenter.server.controller');

module.exports = function (app) {

    app.route('/api/gamecenter/:gcEventSlug/:leagueSlug').all(policy.isAllowed)
        .get(ctrl.get);

    app.param('gcEventSlug', ctrl.bySlug);

};
