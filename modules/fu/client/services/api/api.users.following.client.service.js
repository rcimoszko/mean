'use strict';

angular.module('fu').factory('ApiUsersFollowing', ['$resource',
    function ($resource) {
        return $resource('/api/users/:userId/following', { userId: '@userId' }, {
            update: { method: 'PUT' }
        });
    }
]);

