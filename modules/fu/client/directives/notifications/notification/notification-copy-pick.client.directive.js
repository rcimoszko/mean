'use strict';

angular.module('fu').directive('notificationCopyPick', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-copy-pick.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});