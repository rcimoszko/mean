'use strict';

angular.module('fu').controller('ModalTrialController', ['$scope', '$modalInstance', '$state',
    function($scope, $modalInstance, $state, Modal) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
    }
]);