'use strict';

angular.module('fu').directive('notification', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            notification: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;
            console.log($scope.notification);
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
            }


            var el = $compile(directive)($scope);
            $element.append(el);

            $scope.readNotification = function(notification){
                console.log('read');
            };

        }]
    };
});
