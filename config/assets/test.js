'use strict';

module.exports = {
    tests: {
        client: ['modules/*/tests/client/**/*.js'],
        server: ['modules/*/tests/server/**/*.js'],
        e2e: ['modules/*/tests/e2e/**/*.js']
    },
    client: {
        css: 'public/dist/application.min.css',
        js: 'public/dist/application.min.js'
    }
};
