'use strict';

angular.module('fu').factory('ApiSports', ['$resource',
    function ($resource) {
        return $resource('api/sports/:_id/:action', { _id: '@_id' }, {
            update:         { method: 'PUT' },
            getLeagues:     { method: 'GET', params: {action: 'leagues'}, isArray:true },
            getContestants: { method: 'GET', params: {action: 'contestants'}, isArray:true },
            getGroups: { method: 'GET', params: {action: 'groups'}, isArray:true }
        });
    }
]);