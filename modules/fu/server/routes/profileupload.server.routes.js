'use strict';

var policy = require('../policies/profileupload.server.policies'),
    ctrl = require('../controllers/profileupload.server.controller');

module.exports = function (app) {

    app.route('/api/profileupload')
        .post(ctrl.upload);

};
