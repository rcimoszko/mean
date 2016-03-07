'use strict';

angular.module('fu').factory('ApiPropicksAll', ['$resource',
    function ($resource) {
        return $resource('api/propicks/all', {});
    }
]);