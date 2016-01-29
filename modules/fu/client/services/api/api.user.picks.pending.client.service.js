'use strict';

angular.module('fu').factory('ApiUserPicksPending', ['$resource',
    function ($resource) {
        return $resource('api/user/picks/pending', { }, {
            update: { method: 'PUT' }
        });
    }
]);