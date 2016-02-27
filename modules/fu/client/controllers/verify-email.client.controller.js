'use strict';

angular.module('fu').controller('VerifyEmailController', ['$scope', '$timeout', 'Page', 'Mixpanel', '$stateParams', '$state',
    function($scope,  $timeout, Page,  Mixpanel, $stateParams, $state) {

        $scope.mixpanel = Mixpanel;
        $scope.page = Page;
        $scope.mixpanel.accountVerified();

        if($stateParams.username){
            $scope.username = $stateParams.username;
        }

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