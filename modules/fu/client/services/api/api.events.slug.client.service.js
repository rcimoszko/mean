'use strict';

angular.module('fu').factory('ApiEventsSlug', ['$resource',
    function ($resource) {
        return $resource('api/events/slug/:slug', { slug: '@slug' }, {
            update: { method: 'PUT' }
        });
    }
]);