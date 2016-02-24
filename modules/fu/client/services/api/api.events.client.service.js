'use strict';

angular.module('fu').factory('ApiEvents', ['$resource',
    function ($resource) {
        return $resource('api/events/:_id/:action', { _id: '@_id' }, {
            update: { method: 'PUT' },
            cancel:     { method: 'PUT', params: {action: 'cancel'}},
            report:     { method: 'POST', params: {action: 'report'}},
            reresolve:  { method: 'POST', params: {action: 'reresolve'}},
            resolve:    { method: 'PUT', params: {action: 'resolve'}},
            getPicks:   { method: 'GET', params: {action: 'picks'}, isArray: true}
        });
    }
]);