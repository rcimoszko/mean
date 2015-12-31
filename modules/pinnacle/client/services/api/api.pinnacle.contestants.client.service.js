'use strict';

angular.module('pinnacle').factory('ApiPinnacleContestants', ['$resource',
    function ($resource) {
        return $resource('api/pinnacle/leagues/:_id', { _id: '@__id' }, {
            update: { method: 'PUT' }
        });
    }
]);
