'use strict';

angular.module('fu').factory('ApiUserInfo', ['$resource',
    function ($resource) {
        return $resource('api/user/info', {}, {
            update: { method: 'PUT' }
        });
    }
]);