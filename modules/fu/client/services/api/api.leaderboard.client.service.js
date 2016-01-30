'use strict';

angular.module('fu').factory('ApiLeaderboard', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard', {});
    }
]);