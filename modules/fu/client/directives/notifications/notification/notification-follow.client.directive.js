'use strict';

angular.module('fu').directive('notificationFollow', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-follow.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});