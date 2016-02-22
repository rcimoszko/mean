'use strict';

angular.module('fu').directive('adminScoresTable', function ($compile) {
    return {
        restrict: 'E',
        scope: {
            events:'=',
            sport: '='
        },
        template: '',
        controller:  ['$scope', '$element',  function ( $scope, $element) {
            var directive;
            switch($scope.sport.name){
                case 'basketball':
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


        }]
    };
});
