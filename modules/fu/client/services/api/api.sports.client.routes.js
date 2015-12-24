'use strict';

angular.module('news').factory('ApiSports', ['$resource',
    function ($resource) {
        return $resource('api/sports/:_id', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);