'use strict';

angular.module('fu').directive('betSection', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            contestant1Name: '=',
            contestant2Name: '=',
            betType: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;

            switch($scope.betType){
                case 'moneyline':
                    directive = '<bet-section-moneyline bets="bets" contestant1-name="contestant1Name" contestant2-name="contestant2Name"></bet-section-moneyline>';
                    break;
                case 'spread':
                    directive = '<bet-section-spread bets="bets" contestant1-name="contestant1Name" contestant2-name="contestant2Name"></bet-section-spread>';
                    break;
                case 'total points':
                    directive = '<bet-section-total-points bets="bets"></bet-section-total-points>';
                    break;
                case 'team totals':
                    directive = '<bet-section-team-totals bets="bets" contestant1-name="contestant1Name" contestant2-name="contestant2Name"></bet-section-team-totals>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);


        }]
    };
});
