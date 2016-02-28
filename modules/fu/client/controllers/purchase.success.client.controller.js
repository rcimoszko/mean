'use strict';

angular.module('fu').controller('PurchaseSuccessController', ['$scope', '$timeout', '$stateParams', '$state', '$location',
    function($scope, $timeout, $stateParams, $state, $location) {

        $scope.redirectUrl = $stateParams.redirect;

        $scope.counter = 10;
        $scope.onTimeout = function(){
            $scope.counter--;
            if($scope.counter === 0){
                if($scope.redirectUrl){
                    $location.url($scope.redirectUrl);
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