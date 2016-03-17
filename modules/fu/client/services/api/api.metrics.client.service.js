'use strict';

angular.module('fu').factory('ApiMetrics', ['$resource',
    function ($resource) {
        return $resource('api/metrics', {});
    }
]);
