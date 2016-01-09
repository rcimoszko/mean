'use strict';

angular.module('fu').directive('betSectionTeamTotals', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            contestant1Name: '=',
            contestant2Name: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-team-totals.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});