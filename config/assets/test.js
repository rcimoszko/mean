'use strict';

module.exports = {
    client: {
        css: 'modules/dist/application.min.css',
        js: 'modules/dist/application.min.js'
    },
    tests: {
        client: ['modules/*/tests/client/**/*.js'],
        server: ['modules/*/tests/server/**/*.js'],
        e2e: ['modules/*/tests/e2e/**/*.js']
    }
};
