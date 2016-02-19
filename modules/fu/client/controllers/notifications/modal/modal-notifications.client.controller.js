'use strict';

angular.module('fu').controller('ModalNotificationsController', ['$scope', '$modalInstance', 'Modal', 'User',
    function($scope, $modalInstance, Modal, User) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.notifications = User.info.notifications;

    }
]);

