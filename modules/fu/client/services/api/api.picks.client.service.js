'use strict';

angular.module('fu').factory('ApiPicks', ['$resource',
    function ($resource) {
        return $resource('api/picks/:_id/:action', { _id: '@__id' }, {
            update:  { method: 'PUT' },
            report:  { method: 'PUT', params: {action: 'report'}},
            resolve: { method: 'PUT', params: {action: 'resolve'}}
        });
    }
]);