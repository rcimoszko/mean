'use strict';

angular.module('fu').factory('ApiUserPicksCompleted', ['$resource',
    function ($resource) {
        return $resource('api/user/picks/completed', { }, {
            update: { method: 'PUT' }
        });
    }
]);