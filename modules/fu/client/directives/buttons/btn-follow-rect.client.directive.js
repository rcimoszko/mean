'use strict';

angular.module('fu').directive('btnFollowRect', function () {
    return {
        restrict: 'E',
        scope: {
            userId:'=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-follow-rect.client.template.html',
        controller: ['$scope', 'User', '$filter', 'Follow', function($scope, User, $filter, Follow){
            var following = User.info.following;

            $scope.isFollowing = function(){
                var found = $filter('filter')(following, {_id: $scope.userId});
                return found.length > 0;
            };

            $scope.text = function(){
                if($scope.isFollowing()){
                    return '- Unfollow';
                } else {
                    return '+ Follow';
                }
            };

            $scope.toggleFollow = function(){
                if($scope.isFollowing()){
                    Follow.unfollow($scope.userId);
                } else {
                    Follow.follow($scope.userId);
                }
            };
        }]
    };
});
