'use strict';

angular.module('news').factory('ApiComments', ['$resource',
    function ($resource) {
        return $resource('api/comments/:_id', { _id: '@__id' }, {
            update:       { method: 'PUT' }
        });
    }
]);