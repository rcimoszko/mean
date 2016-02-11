'use strict';

angular.module('fu').filter('shortNameBetType',[function() {
    return function(betType) {
        switch (betType) {
            case 'moneyline':
                return 'ML';
            case 'total points':
                return 'Totals';
            case 'team totals':
                return 'Team Totals';
            case 'spread':
                return 'Spread';
        }
    };
}]);