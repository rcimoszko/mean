'use strict';

angular.module('fu').factory('ApiContestantsPreviews', ['$resource',
    function ($resource) {
        return $resource('api/contestants/:_id/:action', { _id: '@_id' }, {
            update:  { method: 'PUT' },
            merge:   { method: 'PUT', params: {action: 'merge'}}
        });
    }
]);