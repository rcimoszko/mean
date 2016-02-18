'use strict';

angular.module('message').factory('ApiUserConversation', ['$resource',
    function ($resource) {
        return $resource('api/user/conversations', {}, {
            update:       { method: 'PUT' }
        });
    }
]);