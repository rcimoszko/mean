'use strict';

angular.module('fu').factory('ApiPicksComments', ['$resource',
    function ($resource) {
        return $resource('api/picks/:_id/comments', { _id: '@_id' }, {
            update:  { method: 'PUT' }
        });
    }
]);