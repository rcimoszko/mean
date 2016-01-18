'use strict';

angular.module('fu').directive('betSectionGeneral', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            betType: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-general.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;
        }]
    };
});