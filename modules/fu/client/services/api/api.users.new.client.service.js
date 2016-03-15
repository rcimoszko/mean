'use strict';

angular.module('fu').factory('ApiUsersNew', ['$resource',
    function ($resource) {
        return $resource('/api/users/new', {}, {
            update: { method: 'PUT' }
        });
    }
]);

