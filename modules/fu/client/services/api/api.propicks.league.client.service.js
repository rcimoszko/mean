'use strict';

angular.module('fu').factory('ApiPropicksLeague', ['$resource',
    function ($resource) {
        return $resource('api/propicks/league', {});
    }
]);