'use strict';

angular.module('fu').factory('ApiUserFollowingSettings', ['$resource',
    function ($resource) {
        return $resource('api/user/following/settings/:_id', {_id:'@_id'}, {
            update: { method: 'PUT' }
        });
    }
]);