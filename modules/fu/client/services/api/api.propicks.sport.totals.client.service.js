'use strict';

angular.module('fu').factory('ApiPropicksSportTotals', ['$resource',
    function ($resource) {
        return $resource('api/propicks/sport/totals', {});
    }
]);