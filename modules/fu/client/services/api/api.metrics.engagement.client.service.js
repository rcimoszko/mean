'use strict';

angular.module('fu').factory('ApiMetricsEngagement', ['$resource',
    function ($resource) {
        return $resource('api/metrics/engagement', {});
    }
]);
