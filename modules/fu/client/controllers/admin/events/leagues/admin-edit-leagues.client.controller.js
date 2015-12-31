'use strict';

angular.module('fu.admin').controller('AdminEditLeagueController', ['$scope', 'leagueResolve', 'Leagues', '$state',
    function ($scope, leagueResolve, Leagues, $state) {
        $scope.league = leagueResolve;

        $scope.submit = function(){
            function cb(err, league){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.league = league;
                    $state.go('admin.leagues');
                }
            }
            Leagues.update($scope.league, cb);

        };
    }
]);
