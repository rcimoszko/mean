'use strict';

angular.module('fu').filter('betLine',['$filter', function($filter) {
    return function(bet) {
        var text;
        switch(bet.betType){
            case 'spread':
                text = $filter('formatSpread')(bet.spread);
                break;
            case 'total points':
                text = bet.overUnder+' '+$filter('formatPoints')(bet.points);
                break;
            case 'moneyline':
                if(bet.draw){
                    text = 'Draw';
                } else {
                    text = $filter('formatOdds')(bet.odds);
                }
                break;
        }
        return text;
    };
}]);