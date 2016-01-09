'use strict';

angular.module('fu').directive('betSectionMoneyline', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            contestant1Name: '=',
            contestant2Name: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-moneyline.client.template.html',
        controller: ['$scope', function ($scope){
            if('draw' in $scope.bets){
                $scope.isDraw = true;
            }
        }]
    };
});