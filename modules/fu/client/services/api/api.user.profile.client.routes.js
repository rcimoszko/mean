'use strict';

angular.module('news').factory('ApiUserProfile', ['$resource',
    function ($resource) {
        return $resource('api/user/:_id/profile', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);