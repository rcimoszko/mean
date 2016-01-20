'use strict';

angular.module('fu').controller('ModalMakePicksConfirmController', ['$scope', '$modalInstance', 'submitCallback', 'Modal', 'BetSlip',
    function($scope, $modalInstance, submitCallback, Modal, BetSlip) {
        $scope.betSlip = BetSlip;
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        $scope.confirmYes = function(){
            $scope.modal.closeModal($scope.modalInstance);
            $scope.betSlip.submit(submitCallback);
        };
    }
]);

