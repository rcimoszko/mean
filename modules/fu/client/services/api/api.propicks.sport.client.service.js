'use strict';

angular.module('fu').factory('ApiPropicksSport', ['$resource',
    function ($resource) {
        return $resource('api/propicks/sport', {});
    }
]);