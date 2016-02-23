'use strict';

angular.module('articles').factory('ApiArticles', ['$resource',
    function ($resource) {
        return $resource('api/articles/:_id', { _id: '@_id'}, { update: {method: 'PUT' }
        });
    }
]);
