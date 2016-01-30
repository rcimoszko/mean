'use strict';

angular.module('fu').factory('ApiLeaderboardLeagues', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard/leagues');
    }
]);