'use strict';

angular.module('fu').factory('ApiChannels', ['$resource',
    function ($resource) {
        return $resource('api/channels/:_id/:action', { _id: '@_id' }, {
            update:       { method: 'PUT' },
            subscribe:    { method: 'POST', params: {action: 'subscribe'}},
            unsubscribe:  { method: 'POST', params: {action: 'unsubscribe'}}
        });
    }
]);