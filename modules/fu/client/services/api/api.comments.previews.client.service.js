'use strict';

angular.module('fu').factory('ApiCommentsPreviews', ['$resource',
    function ($resource) {
        return $resource('api/comments/:_id/previews', { _id: '@_id' }, {
            update:       { method: 'PUT' }
        });
    }
]);