'use strict';

angular.module('fu').factory('ApiComments', ['$resource',
    function ($resource) {
        return $resource('api/comments/:_id', { _id: '@_id' }, {
            update:       { method: 'PUT' }
        });
    }
]);