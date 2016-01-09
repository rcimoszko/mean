'use strict';

angular.module('fu').directive('betSectionSpread', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            contestant1Name: '=',
            contestant2Name: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-spread.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});