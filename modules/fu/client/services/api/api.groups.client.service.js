'use strict';

angular.module('fu').factory('ApiGroups', ['$resource',
    function ($resource) {
        return $resource('api/groups/:_id', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);