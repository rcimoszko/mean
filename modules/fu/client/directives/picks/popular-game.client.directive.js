'use strict';

angular.module('fu').directive('popularGame', function () {
    return {
        restrict: 'E',
        scope: {
            popularGame: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/popular-game.client.template.html',
        controller: ['$scope', function ($scope){
        }]
    };
});