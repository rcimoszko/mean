'use strict';

angular.module('fu').factory('ApiMetricsGeneral', ['$resource',
    function ($resource) {
        return $resource('api/metrics/general', {});
    }
]);
