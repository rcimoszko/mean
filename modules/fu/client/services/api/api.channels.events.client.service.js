'use strict';

angular.module('fu').factory('ApiChannelsEvents', ['$resource',
    function ($resource) {
        return $resource('api/channels/:slug/events', { slug: '@_slug' });
    }
]);