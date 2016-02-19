'use strict';

angular.module('fu').directive('notificationPickComment', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-pick-comment.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});