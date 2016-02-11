'use strict';

angular.module('fu').factory('ApiChannelsContent', ['$resource',
    function ($resource) {
        return $resource('api/channels/:slug/content', { slug: '@_slug' });
    }
]);