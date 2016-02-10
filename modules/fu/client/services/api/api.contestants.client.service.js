'use strict';

angular.module('fu').factory('ApiCommentsPreviews', ['$resource',
    function ($resource) {
        return $resource('api/comments/previews', {}, {
            update:       { method: 'PUT' }
        });
    }
]);