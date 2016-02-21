'use strict';

angular.module('fu').directive('notification', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        template: '',
        controller:  ['$scope', '$element', 'User',  function ( $scope, $element, User) {
            var directive;

            switch($scope.notification.type){
                case 'follow':
                    directive = '<notification-follow notification="notification"></notification-follow>';
                    break;
                case 'copy pick':
                    directive = '<notification-copy-pick notification="notification"></notification-copy-pick>';
                    break;
                case 'pick comment':
                    directive = '<notification-pick-comment notification="notification"></notification-pick-comment>';
                    break;
                case 'comment reply':
                    directive = '<notification-comment-reply notification="notification"></notification-comment-reply>';
                    break;
                case 'activity':
                    directive = '<notification-activity notification="notification"></notification-activity>';
                    break;
            }


            var el = $compile(directive)($scope);
            $element.append(el);

            $scope.readNotification = function(notification){
                function cb(err, updatedNotif){
                    if(!err) notification.new = false;
                }

                User.readNotification(notification, cb);
            };

        }]
    };
});
