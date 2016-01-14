'use strict';

angular.module('fu').directive('betSectionTotalPoints', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: 'event'
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-total-points.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;

        }]
    };
});