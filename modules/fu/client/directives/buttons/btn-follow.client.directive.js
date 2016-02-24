'use strict';

angular.module('fu').directive('btnFollow', function () {
    return {
        restrict: 'E',
        scope: {
            userId:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-follow.client.template.html',
        controller: ['$scope', 'User', '$filter', 'Follow', 'Authentication', function($scope, User, $filter, Follow, Authentication){
            var following = User.info.following;
            $scope.authentication = Authentication;

            $scope.isFollowing = function(){
                var found = $filter('filter')(following, {_id: $scope.userId});
                return found.length > 0;
            };


            $scope.imgUrl = function(){
                if($scope.isFollowing()){
                    return 'modules/fu/client/img/buttons/follow/following.png';
                } else {
                    return 'modules/fu/client/img/buttons/follow/follow.png';
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