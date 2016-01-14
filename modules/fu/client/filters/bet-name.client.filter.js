'use strict';

angular.module('fu').filter('betName',['$filter', function($filter) {
    return function(pick, event) {
        var text;
        switch(pick.betType){
            case 'spread':
                text = pick.contestant.name+' '+$filter('formatSpread')(pick.spread);
                break;
            case 'total points':
                text = pick.overUnder+' '+$filter('formatPoints')(pick.points) +' ' + $filter('pointName')(event);
                break;
            case 'team totals':
                text = pick.contestant.name+' '+pick.overUnder+' '+$filter('formatPoints')(pick.points) + ' ' + $filter('pointName')(event);
                break;
            case 'moneyline':
                if(pick.draw){
                    text = 'Draw';
                } else {
                    text = pick.contestant.name;
                }
                break;
            case 'sets':
                text = pick.contestant.name+' '+$filter('displayPoints')(pick.spread)+' sets';
                break;
        }
        return text;
    };
}]);