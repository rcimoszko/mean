'use strict';

angular.module('fu').factory('ApiPropicksLeagueTotals', ['$resource',
    function ($resource) {
        return $resource('api/propicks/league/totals', {});
    }
]);