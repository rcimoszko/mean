'use strict';

angular.module('message').factory('ApiConversations', ['$resource',
    function ($resource) {
        return $resource('api/conversations/:_id', { _id: '@_id' }, {
            update:       { method: 'PUT' }
        });
    }
]);
