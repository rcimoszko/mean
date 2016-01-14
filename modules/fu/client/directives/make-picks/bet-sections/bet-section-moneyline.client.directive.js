'use strict';

angular.module('fu').directive('betSectionMoneyline', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bet-sections/bet-section-moneyline.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1Name = $scope.event.contestant1.name;
            $scope.contestant2Name = $scope.event.contestant2.name;
            if($scope.bets && 'draw' in $scope.bets){
                $scope.isDraw = true;
            }
        }]
    };
});