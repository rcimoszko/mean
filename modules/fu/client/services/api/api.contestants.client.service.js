'use strict';

angular.module('fu').factory('ApiContestants', ['$resource',
    function ($resource) {
        return $resource('api/contestants/:_id/:action', { _id: '@__id' }, {
            update:  { method: 'PUT' },
            merge:   { method: 'PUT', params: {action: 'merge'}}
        });
    }
]);