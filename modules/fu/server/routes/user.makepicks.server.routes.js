'use strict';

var policy = require('../policies/user.makepicks.server.policies'),
    ctrl = require('../controllers/user.makepicks.server.controller');

module.exports = function (app) {

    app.route('/api/user/makepicks').all(policy.isAllowed)
        .post(ctrl.submit);

};
