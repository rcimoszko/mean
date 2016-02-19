'use strict';

angular.module('fu').factory('ApiUserNotification', ['$resource',
    function ($resource) {
        return $resource('api/user/notifications/:_id/read', {_id: '@_id' }, {
            update: { method: 'PUT' }
        });
    }
]);