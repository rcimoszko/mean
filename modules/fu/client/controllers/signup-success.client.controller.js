'use strict';

angular.module('fu').controller('SignUpSucesssController', ['$scope', '$state', '$stateParams', '$timeout', '$location',
    function($scope, $state, $stateParams, $timeout, $location) {

        $scope.counter = 10;
        $scope.redirectUrl = $stateParams.redirect;


        $scope.onTimeout = function(){
            $scope.counter--;
            if($scope.counter === 0){
                if($scope.redirectUrl) {
                    $location.url($scope.redirectUrl);
                } else {
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

