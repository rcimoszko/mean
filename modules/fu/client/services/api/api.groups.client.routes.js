'use strict';

angular.module('news').factory('ApiGroups', ['$resource',
    function ($resource) {
        return $resource('api/groups/:_id', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);