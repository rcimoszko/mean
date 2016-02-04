'use strict';

angular.module('fu').factory('ApiUserFollowing', ['$resource',
    function ($resource) {
        return $resource('api/user/following', {}, {
            update: { method: 'PUT' }
        });
    }
]);