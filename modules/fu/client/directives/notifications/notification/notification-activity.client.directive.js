'use strict';

angular.module('fu').directive('notificationActivity', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-activity.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});