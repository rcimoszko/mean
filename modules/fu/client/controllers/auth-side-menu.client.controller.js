'use strict';

angular.module('fu').controller('AuthSideMenuController', ['$scope', '$filter', '$location', 'Modal', 'Authentication', 'User', '$rootScope',
    function ($scope, $filter, $location, Modal, Authentication, User, $rootScope) {
        $scope.authentication = Authentication;
        $scope.user = User;
        $scope.showSideMenu = false;

        $scope.isActive = function(page){
            return page === $location.url();
        };

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

        $rootScope.$on('toggleSideMenu', function(){
            $scope.toggleSideMenu();
        });

        $scope.toggleSideMenu = function(){
            $scope.showSideMenu = !$scope.showSideMenu;
        };

    }
]);
