'use strict';

angular.module('fu').controller('PurchaseSuccessController', ['$scope', '$timeout', '$stateParams', '$state',
    function($scope, $timeout, $stateParams, $state) {


        $scope.counter = 5;
        $scope.onTimeout = function(){
            $scope.counter--;
            if($scope.counter === 0){
                if($scope.username){
                    $state.go('profile',{username:$scope.username});
                } else{
                    $state.go('hub');
                }
            }
            $scope.myTimeout = $timeout($scope.onTimeout,1000);
        };
        $scope.myTimeout = $timeout($scope.onTimeout,1000);

        $scope.stop = function(){
            $timeout.cancel($scope.myTimeout);
        };

    }
]);