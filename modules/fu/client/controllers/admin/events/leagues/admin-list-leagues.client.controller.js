'use strict';

angular.module('fu.admin').controller('AdminListLeaguesController', ['$scope', 'Sports',
    function ($scope, Sports) {

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
    }
]);
