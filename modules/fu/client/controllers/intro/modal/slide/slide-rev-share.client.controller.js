'use strict';

angular.module('fu').controller('SlideRevShareController', ['$scope', 'Leaderboard',
    function($scope, Leaderboard) {

        var query = {
            sportId:        'all',
            leagueId:       'all',
            contestantId:   'all',
            homeAway:       'both',
            betDuration:    'all',
            betType:        'all',
            minBets:        'all',
            dateId:         'thisMonth',
            count:          5
        };

        function cb(err, leaderboard){
            console.log(leaderboard);
            $scope.leaderboard = leaderboard;
        }

        Leaderboard.getLeaderboard(query, cb);

    }
]);