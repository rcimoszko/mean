'use strict';

angular.module('fu').directive('btnMessage', function () {
    return {
        restrict: 'E',
        scope: {
            username:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-message.client.template.html',
        controller: ['$scope', '$state', 'Authentication', function($scope, $state ,Authentication){
            $scope.authentication = Authentication;
            $scope.buttonClicked = function(){
                if(!$scope.authentication.user) {
                    $state.go('signup');
                } else {
                    $state.go('messages.newWithUser', {username:$scope.username});
                }
            };
        }]
    };
});
