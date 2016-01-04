'use strict';

angular.module('fu.admin').controller('AdminEditContestantController', ['$scope', 'contestantResolve', 'Contestants', '$state',
    function ($scope, contestantResolve, Contestants, $state) {
        $scope.contestant = contestantResolve;

        $scope.submit = function(){
            function cb(err, contestant){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.contestant = contestant;
                    $state.go('admin.contestants');
                }
            }
            Contestants.update($scope.contestant, cb);

        };
    }
]);
