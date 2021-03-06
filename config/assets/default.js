'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/intro.js/minified/introjs.min.css',
        'public/lib/intro.js/minified/introjs-rtl.min.css',
        'public/lib/textAngular/dist/textAngular.css'
      ],
      js: [
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-slugify/angular-slugify.js',
        'public/lib/angular-google-chart/ng-google-chart.js',
        'public/lib/angulargrid/angulargrid.min.js',
        'public/lib/lrInfiniteScroll/lrInfiniteScroll.js',
        'public/lib/moment/min/moment-with-locales.min.js',
        'public/lib/angular-moment/angular-moment.min.js',
        'public/lib/textAngular/dist/textAngular-rangy.min.js',
        'public/lib/textAngular/dist/textAngular-sanitize.min.js',
        'public/lib/textAngular/dist/textAngular.min.js',
        'public/lib/angular-filter/dist/angular-filter.min.js',
        'public/lib/angular-scroll-glue/src/scrollglue.js',
        'public/lib/ng-csv/build/ng-csv.min.js',
        //'public/lib/angular-scrolltofixed/dist/angular-scrolltofixed.min.js'
        'public/lib/ngSticky/dist/sticky.min.js',
        'public/lib/angulartics/dist/angulartics.min.js',
        'public/lib/angulartics-google-analytics/dist/angulartics-google-analytics.min.js',
        'public/lib/intro.js/minified/intro.min.js',
        'public/lib/angular-intro.js/build/angular-intro.min.js',
        'public/lib/re-tree/re-tree.min.js',
        'public/lib/ng-device-detector/ng-device-detector.min.js'
      ],
      tests: ['public/lib/angular-mocks/angular-mocks.js']
    },
    css: [
      'modules/*/client/css/*.css'
    ],
    less: [
      'modules/*/client/less/*.less'
    ],
    sass: [
      'modules/*/client/scss/*.scss'
    ],
    js: [
      'modules/core/client/app/config.js',
      'modules/core/client/app/init.js',
      'modules/*/client/*.js',
      'modules/*/client/**/*.js'
    ],
    views: ['modules/*/client/views/**/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: 'gruntfile.js',
    gulpConfig: 'gulpfile.js',
    allJS: ['server.js', 'config/**/*.js', 'modules/*/server/**/*.js'],
    models: 'modules/*/server/models/**/*.js',
    routes: ['modules/!(core)/server/routes/**/*.js', 'modules/core/server/routes/**/*.js'],
    sockets: 'modules/*/server/sockets/**/*.js',
    config: 'modules/*/server/config/*.js',
    policies: 'modules/*/server/policies/*.js',
    views: 'modules/*/server/views/*.html'
  }
};
