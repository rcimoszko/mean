'use strict';

angular.module('pinnacle').factory('ApiPinnacleLeagues', ['$resource',
    function ($resource) {
        return $resource('api/pinnacle/leagues/:_id/:get', { _id: '@__id' }, {
            update:          { method: 'PUT' },
            getContestants:  { method: 'GET', params: {get: 'contestants'}}
        });
    }
]);