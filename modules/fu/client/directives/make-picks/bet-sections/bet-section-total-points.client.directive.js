'use strict';

angular.module('fu').directive('betSectionTotalPoints', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-total-points.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});