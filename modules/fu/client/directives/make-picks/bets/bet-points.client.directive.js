'use strict';

angular.module('fu').directive('betPoints', function () {
    return {
        restrict: 'E',
        scope: {
            bets: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/bets/bet-points.client.template.html',
        controller: ['$scope', '$filter', function ($scope, $filter){
            $scope.addBet = $scope.$parent.addBet;
            if($scope.bets){
                $scope.activeBet = $filter('filter')($scope.bets, {active:true})[0];
                var altLines = $filter('filter')($scope.bets, {altLine:true});
                if(altLines.length){
                    $scope.isAlt = true;
                }
            }

            $scope.setActive = function(bet){
                $scope.bets[$scope.bets.indexOf($scope.activeBet)].active = false;
                bet.active = true;
                $scope.activeBet = bet;
            };
        }]
    };
});