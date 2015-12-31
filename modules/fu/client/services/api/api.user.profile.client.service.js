'use strict';

angular.module('fu').factory('ApiUserProfile', ['$resource',
    function ($resource) {
        return $resource('api/user/:_id/profile', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);