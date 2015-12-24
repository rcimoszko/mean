'use strict';

var ctrl = require('../controllers/users.server.controller');

module.exports = function (app) {

    app.param('username', ctrl.byUsername);
};
