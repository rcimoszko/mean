'use strict';

angular.module('pinnacle').factory('ApiPinnacleSports', ['$resource',
    function ($resource) {
        return $resource('api/pinnacle/sports/:_id/:get', { _id: '@__id' }, {
            update:             { method: 'PUT' },
            getContestants:     { method: 'GET', params: {get: 'contestants'}},
            getLeagues:         { method: 'GET', params: {get: 'leagues'}}
        });
    }
]);
