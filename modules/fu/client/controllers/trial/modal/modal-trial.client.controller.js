'use strict';

angular.module('fu').controller('ModalTrialController', ['$scope', '$modalInstance', '$state', 'Trial', 'Authentication', 'User', '$location',
    function($scope, $modalInstance, $state, Modal, Trial, Authentication, User, $location) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        $scope.authentication = Authentication;
        $scope.user = User;

        $scope.activateTrial = function(){
            function cb(err){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.modal.closeModal($scope.modalInstance);
                    $state.go('trialSuccess', {redirect: $location.path()});
                }
            }

            Trial.activate(cb);
        };

    }
]);