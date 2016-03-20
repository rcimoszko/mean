'use strict';

angular.module('fu').controller('SlidePickController', ['$scope', 'Leaderboard', '$filter',
    function($scope, Leaderboard, $filter) {

        var query = {
            sportId:        'all',
            leagueId:       'all',
            contestantId:   'all',
            homeAway:       'both',
            betDuration:    'all',
            betType:        'all',
            minBets:        'all',
            dateId:         'last30Days'
        };

        function cb(err, leaderboard){
            $scope.leaders = $filter('filter')(leaderboard, function(leaderboard){
                return leaderboard.pending > 0;
            });
            $scope.leaders = $filter('limitTo')($scope.leaders, 3);
        }

        Leaderboard.getLeaderboard(query, cb);
    }
]);