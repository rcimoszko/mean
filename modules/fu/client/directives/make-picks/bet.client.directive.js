'use strict';

angular.module('fu').directive('bet', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '=',
            betType: '='
        },
        template: '',
        controller:  ['$scope', '$element', 'BetSlip',  function ( $scope, $element, BetSlip) {
            var directive;
            switch($scope.betType){
                case 'moneyline':
                    directive = '<bet-moneyline bets="bets"></bet-moneyline>';
                    break;
                case 'spread':
                    directive = '<bet-spread bets="bets"></bet-spread>';
                    break;
                case 'points':
                    directive = '<bet-points bets="bets"></bet-points>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);

            $scope.addBet = function(bet){
                BetSlip.addRemove(bet, $scope.event);
            };

        }]
    };
});
