'use strict';

angular.module('fu').directive('btnFollowRect', function () {
    return {
        restrict: 'E',
        scope: {
            userId:'=',
            size: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-follow-rect.client.template.html',
        controller: ['$scope', 'Users', function($scope, Users){
            $scope.toggleFollow = function(){

            };
        }]
    };
});