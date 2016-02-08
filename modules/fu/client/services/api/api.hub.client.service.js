'use strict';

angular.module('fu').factory('ApiHub', ['$resource',
    function ($resource) {
        return $resource('api/hub', {});
    }
]);