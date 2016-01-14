'use strict';

angular.module('fu').directive('betSectionTeamTotals', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-team-totals.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;
        }]
    };
});