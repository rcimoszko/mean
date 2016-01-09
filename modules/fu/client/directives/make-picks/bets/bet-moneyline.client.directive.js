'use strict';

angular.module('fu').directive('betMoneyline', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bets/bet-moneyline.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.bet = $scope.bets[0];
        }]
    };
});