'use strict';

angular.module('fu').directive('betSection', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            bets: '=',
            event: '=',
            betType: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;

            switch($scope.betType){
                case 'moneyline':
                    directive = '<bet-section-moneyline event="event" bets="bets"></bet-section-moneyline>';
                    break;
                case 'spread':
                    directive = '<bet-section-spread event="event" bets="bets"></bet-section-spread>';
                    break;
                case 'total points':
                    directive = '<bet-section-total-pointsevent="event"  bets="bets"></bet-section-total-points>';
                    break;
                case 'team totals':
                    directive = '<bet-section-team-totals event="event" bets="bets"></bet-section-team-totals>';
                    break;
            }

            var el = $compile(directive)($scope);
            $element.append(el);


        }]
    };
});