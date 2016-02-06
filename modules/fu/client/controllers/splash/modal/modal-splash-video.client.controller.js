'use strict';

angular.module('fu').controller('ModalSplashVideoController', ['$scope', '$modalInstance', 'Modal',
    function($scope, $modalInstance, Modal) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
    }
]);

