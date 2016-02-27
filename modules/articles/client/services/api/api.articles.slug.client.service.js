'use strict';

angular.module('articles').factory('ApiArticlesSlug', ['$resource',
    function ($resource) {
        return $resource('api/articles/slug/:articleSlug', { articleSlug: '@slug'}, { update: {method: 'PUT' }
        });
    }
]);
