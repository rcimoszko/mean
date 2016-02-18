'use strict';

angular.module('fu').factory('ApiPicksComments', ['$resource',
    function ($resource) {
        return $resource('api/picks/:pick/comments/:_id', { _id: '@_id', pick: '@pick' }, {
            update:  { method: 'PUT' }
        });
    }
]);