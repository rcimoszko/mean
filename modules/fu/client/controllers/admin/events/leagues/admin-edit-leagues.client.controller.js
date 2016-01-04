'use strict';

angular.module('fu.admin').controller('AdminEditLeagueController', ['$scope', '$stateParams', 'Leagues', 'Sports', '$state',
    function ($scope, $stateParams, Leagues, Sports, $state) {

        function cb_getGroups(err, groups){
            $scope.groups = groups;
        }

        function cb_getLeague(err, league){
            $scope.league = league;
            Sports.getGroups($scope.league.sport.ref, cb_getGroups);
        }

        Leagues.get($stateParams.leagueId, cb_getLeague);

        $scope.submit = function(){
            function cb(err, league){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.league = league;
                    $state.go('admin.leaguesBySport', {sportId: $scope.league.sport.ref});
                }
            }
            Leagues.update($scope.league, cb);

        };
    }
]);
