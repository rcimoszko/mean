'use strict';

angular.module('fu').factory('ApiSports', ['$resource',
    function ($resource) {
        return $resource('api/sports/:_id', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);