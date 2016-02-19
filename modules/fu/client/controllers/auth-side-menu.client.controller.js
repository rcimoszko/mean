'use strict';

angular.module('fu').controller('AuthSideMenuController', ['$scope', '$filter', 'Modal', 'Authentication', 'User',
    function ($scope, $filter, Modal, Authentication, User) {
        $scope.authentication = Authentication;
        $scope.user = User;

        $scope.notificationCount = function(){
            return $filter('filter')($scope.user.info.notifications, {'new':true}).length;
        };

        $scope.showMyPicks = function(){
            Modal.showModal(
                'modules/fu/client/views/users/modal/modal-my-picks.client.view.html',
                'ModalMyPicksController',
                {},
                'my-picks'
            );
        };

        $scope.showChannelSelect = function(){
            Modal.showModal(
                'modules/fu/client/views/channels/modal/modal-choose-channels.client.view.html',
                'ModalChooseChannelsController',
                {},
                'choose-channels'
            );
        };

        $scope.showNotifications = function(){
            Modal.showModal(
                'modules/fu/client/views/notifications/modal/modal-notifications.client.view.html',
                'ModalNotificationsController',
                {},
                'notifications'
            );
        };

    }
]);
