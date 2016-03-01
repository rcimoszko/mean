'use strict';

module.exports = {
    client: {
        css: 'public/dist/application.min.css',
        js: 'public/dist/application.min.js'
    },
    tests: {
        client: ['modules/*/tests/client/**/*.js'],
        server: ['modules/*/tests/server/**/*.js'],
        e2e: ['modules/*/tests/e2e/**/*.js']
    }
};
