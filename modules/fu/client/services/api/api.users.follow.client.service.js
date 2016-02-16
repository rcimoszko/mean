'use strict';

angular.module('fu').factory('ApiUsersFollow', ['$resource',
    function ($resource) {
        return $resource('/api/users/:userId/follow', { userId: '@userId' }, {
            update: { method: 'PUT' }
        });
    }
]);

