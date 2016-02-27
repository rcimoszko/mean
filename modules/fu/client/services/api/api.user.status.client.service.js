'use strict';

angular.module('fu').factory('ApiUserStatus', ['$resource',
    function ($resource) {
        return $resource('api/user/status', {}, {
            update: { method: 'PUT' }
        });
    }
]);