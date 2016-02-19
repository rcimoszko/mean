'use strict';

angular.module('fu').directive('notificationCommentReply', function () {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        templateUrl: 'modules/fu/client/templates/notifications/notification/notification-comment-reply.client.template.html',
        controller: ['$scope', function ($scope){

            $scope.readNotification = $scope.$parent.readNotification;
        }]
    };
});