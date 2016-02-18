'use strict';

angular.module('fu').factory('ApiEventsComments', ['$resource',
    function ($resource) {
        return $resource('api/events/:event/comments/:_id', { _id: '@_id', event: '@event' }, {
            update:  { method: 'PUT' }
        });
    }
]);