'use strict';

angular.module('fu.admin').controller('AdminEditSportController', ['$scope', 'sportResolve', 'Sports', '$state',
    function ($scope, sportResolve, Sports, $state) {
        $scope.sport = sportResolve;

        $scope.submit = function(){
            function cb(err, sport){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.sport = sport;
                    $state.go('admin.sports');
                }
            }
            Sports.update($scope.sport, cb);

        };
    }
]);
