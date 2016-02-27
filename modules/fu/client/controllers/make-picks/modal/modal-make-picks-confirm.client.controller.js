'use strict';

angular.module('fu').controller('ModalMakePicksConfirmController', ['$scope', '$modalInstance', 'submitCallback', 'Modal', 'BetSlip', 'Loading', 'Authentication', '$location',
    function($scope, $modalInstance, submitCallback, Modal, BetSlip, Loading, Authentication, $location) {
        $scope.betSlip = BetSlip;
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.loading = Loading;
        $scope.authentication = Authentication;
        $scope.location = $location;

        $scope.confirmYes = function(){
            $scope.betSlip.submit(submitCallback);
        };

        $scope.modalInstance.result.then(function (selectedItem) {
        }, function () {
            $scope.betSlip.status.submitted = false;
        });
    }
]);

