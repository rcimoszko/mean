'use strict';

angular.module('fu').factory('ApiUserMessagecount', ['$resource',
    function ($resource) {
        return $resource('api/user/messagecount', {}, {
            update: { method: 'PUT' }
        });
    }
]);