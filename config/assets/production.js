'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
          'public/lib/intro.js/minified/introjs.min.css',
          'public/lib/intro.js/minified/introjs-rtl.min.css',
         'public/lib/textAngular/dist/textAngular.css'
      ],
      js: [
        'public/lib/angular/angular.min.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/angular-ui-utils/ui-utils.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
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
      ]
    },
    css: 'public/dist/application.min.css',
    js: 'public/dist/application.min.js'
  }
};
