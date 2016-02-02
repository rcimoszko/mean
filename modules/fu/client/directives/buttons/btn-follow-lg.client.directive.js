'use strict';

angular.module('fu').directive('btnFollowLg', function () {
    return {
        restrict: 'E',
        scope: {
            userId:'='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-follow-lg.client.template.html',
        controller: ['$scope', 'Users', function($scope, Users){
            $scope.toggleFollow = function(){

            };
        }]
    };
});