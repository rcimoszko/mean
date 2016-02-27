'use strict';

angular.module('fu').directive('btnSubscribe', function () {
    return {
        restrict: 'E',
        scope: {
            channelId:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-subscribe.client.template.html',
        controller: ['$scope', '$state', '$filter', 'User', 'Channels', 'Authentication', function($scope, $state, $filter, User, Channels, Authentication){
            var channels = User.info.channels;
            $scope.authentication = Authentication;

            $scope.isSubscribed = function(){
                var found = $filter('filter')(channels, {_id: $scope.channelId });
                return found.length > 0;
            };


            $scope.text = function(){
                if($scope.isSubscribed()){
                    return '- Unsubscribe';
                } else {
                    return '+ Subscribe';
                }
            };

            $scope.toggleSubscribe = function(){
                if(!$scope.authentication.user) $state.go('signup');
                if($scope.isSubscribed()){
                    Channels.unsubscribe($scope.channelId);
                } else {
                    Channels.subscribe($scope.channelId);
                }
            };
        }]
    };
});