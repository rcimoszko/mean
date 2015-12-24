'use strict';

angular.module('news').factory('ApiEventsGamecenter', ['$resource',
    function ($resource) {
        return $resource('api/events/:_id/gamecenter', { _id: '@__id' });
    }
]);