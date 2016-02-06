'use strict';

angular.module('fu').directive('btnSubscribe', function () {
    return {
        restrict: 'E',
        scope: {
            channelId:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-subscribe.client.template.html',
        controller: ['$scope', 'Users', function($scope, Users){
            $scope.toggleSubscribe = function(){

            };
        }]
    };
});