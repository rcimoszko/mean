'use strict';

angular.module('fu').factory('ApiUsersUnfollow', ['$resource',
    function ($resource) {
        return $resource('/api/users/:userId/unfollow', { userId: '@userId' }, {
            update: { method: 'PUT' }
        });
    }
]);

