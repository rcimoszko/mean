'use strict';

angular.module('fu').factory('ApiTrialActivate', ['$resource',
    function ($resource) {
        return $resource('api/trial/activate', {});
    }
]);