'use strict';

angular.module('fu').directive('btnFollowRect', function () {
    return {
        restrict: 'E',
        scope: {
            userId:'=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-follow-rect.client.template.html',
        controller: ['$scope', 'User', '$filter', 'Follow', 'Authentication', '$state', function($scope, User, $filter, Follow, Authentication, $state){
            var following = User.info.following;
            $scope.authentication = Authentication;

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
                if(!$scope.authentication.user) {
                    $state.go('signup');
                } else {
                    if($scope.isFollowing()){
                        Follow.unfollow($scope.userId);
                    } else {
                        Follow.follow($scope.userId);
                    }
                }
            };
        }]
    };
});
