'use strict';

angular.module('fu').factory('ApiLeaderboardContestants', ['$resource',
    function ($resource) {
        return $resource('api/leaderboard/contestants/:leagueId');
    }
]);