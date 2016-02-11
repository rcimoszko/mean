'use strict';

angular.module('fu').filter('shortBetName',['$filter', function($filter) {
    return function(pick, event) {
        var text;
        var shortNameArray = pick.contestant.name.split(' ');
        var shortName = shortNameArray[shortNameArray.length-1];
        switch(pick.betType){
            case 'spread':
                text = shortName+' '+$filter('formatSpread')(pick.spread);
                break;
            case 'total points':
                text = pick.overUnder+' '+$filter('formatPoints')(pick.points) +' ' + $filter('pointName')(event);
                break;
            case 'team totals':
                text = shortName+' '+pick.overUnder+' '+$filter('formatPoints')(pick.points) + ' ' + $filter('pointName')(event);
                break;
            case 'moneyline':
                if(pick.draw){
                    text = 'Draw';
                } else {
                    text = shortName + ' Moneyline';
                }
                break;
            case 'sets':
                text = shortName+' '+$filter('formatSpread')(pick.spread)+' sets';
                break;
        }
        return text;
    };
}]);