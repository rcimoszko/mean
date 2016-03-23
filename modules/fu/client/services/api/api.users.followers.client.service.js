'use strict';

angular.module('fu').factory('ApiUsersFollowers', ['$resource',
    function ($resource) {
        return $resource('/api/users/:userId/followers', { userId: '@userId' }, {
            update: { method: 'PUT' }
        });
    }
]);

