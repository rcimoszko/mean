'use strict';

angular.module('fu').controller('ModalNotificationsController', ['$scope', '$modalInstance', 'Modal', 'User', 'Authentication',
    function($scope, $modalInstance, Modal, User, Authentication) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.notifications = User.info.notifications;
        $scope.authentication = Authentication;

    }
]);

