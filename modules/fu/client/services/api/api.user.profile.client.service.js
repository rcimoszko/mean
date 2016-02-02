'use strict';

angular.module('fu').factory('ApiUserProfile', ['$resource',
    function ($resource) {
        return $resource('api/users/:username/profile', { username: '@username' }, {
            update: { method: 'PUT' }
        });
    }
]);