'use strict';

angular.module('fu').controller('SignUpSucesssController', ['$scope', '$state', '$stateParams', '$timeout', '$location', 'Modal',
    function($scope, $state, $stateParams, $timeout, $location, Modal) {


        $scope.redirectUrl = $stateParams.redirect;

        Modal.showModal(
            '/modules/fu/client/views/intro/modal/modal-intro.client.view.html',
            'ModalIntroController',
            null,
            'intro'
        );


        /*
        $scope.counter = 10;
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
        */
    }
]);

