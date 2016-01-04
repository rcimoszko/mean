'use strict';

angular.module('fu.admin').controller('AdminListContestantsController', ['$scope', 'Sports', 'Leagues',
    function ($scope, Sports, Leagues) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.getLeagues = function(){
            function cb(err, leagues){
                $scope.leagues = leagues;
            }
            Sports.getLeagues($scope.sport, cb);
        };

        $scope.getLeagueContestants = function(){
            function cb(err, contestants){
                $scope.contestants = contestants;
            }
            Leagues.getContestants($scope.league._id, cb);
        };

        $scope.getSportContestants = function(){
            function cb(err, contestants){
                $scope.contestants = contestants;
            }
            Sports.getContestants($scope.sport._id, cb);
        };
    }
]);
