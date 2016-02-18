'use strict';

angular.module('fu').directive('replies', function(RecursionHelper) {
    return {
        restrict: 'E',
        scope: {
            replies: '=',
            event: '=',
            pick: '=',
            replyIndex: '=',
            comment: '='
        },
        compile: function(element) {
            return RecursionHelper.compile(element);
        },
        templateUrl: 'modules/fu/client/templates/comments/replies.client.template.html',
        controller: ['$scope', '$filter', function($scope, $filter) {

            $scope.getAvatarUrl = function(user){
                var userFound = $filter('filter')($scope.comment.users, {_id: user.ref});
                return userFound[0].avatarUrl;
            };
        }]
    };
});