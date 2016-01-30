'use strict';

angular.module('fu').factory('ApiLeaderboardSports', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard/sports');
    }
]);