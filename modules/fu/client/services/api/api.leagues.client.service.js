'use strict';

angular.module('fu').factory('ApiLeagues', ['$resource',
    function ($resource) {
        return $resource('api/leagues/:_id/:action', { _id: '@_id' }, {
            update:     { method: 'PUT' },
            getContestants: { method: 'GET', params: {action: 'contestants'}, isArray:true }
        });
    }
]);