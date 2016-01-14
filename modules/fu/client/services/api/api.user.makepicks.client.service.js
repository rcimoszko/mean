'use strict';

angular.module('fu').factory('ApiUserMakePicks', ['$resource',
    function ($resource) {
        return $resource('api/user/makepicks', {}, {
            update: { method: 'PUT' }
        });
    }
]);