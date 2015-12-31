'use strict';

angular.module('fu').factory('ApiEventsGamecenter', ['$resource',
    function ($resource) {
        return $resource('api/events/:_id/gamecenter', { _id: '@_id' });
    }
]);