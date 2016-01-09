'use strict';

angular.module('fu.admin').controller('AdminListLeaguesController', ['$scope', '$stateParams', '$state', 'Sports',
    function ($scope, $stateParams, $state, Sports) {

        function cb_getSports(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb_getSports);

        $scope.getLeagues = function(){
            $state.go('admin.leaguesBySport', {sportId:$scope.sport});
        };


        function cb_getLeagues(err, leagues){
            $scope.leagues = leagues;
        }

        if($stateParams.sportId){
            $scope.sport = $stateParams.sportId;
            Sports.getLeagues($stateParams.sportId, cb_getLeagues);

        }

        $scope.activeFilterEnabled = false;

        $scope.activeFilter = function(sport){
            if($scope.activeFilterEnabled){
                return sport.active;
            }
            return true;
        };
    }
]);
