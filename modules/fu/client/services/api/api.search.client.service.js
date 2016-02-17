'use strict';

angular.module('fu').factory('ApiSearch', ['$resource',
    function ($resource) {
        return $resource('api/search', {});
    }
]);