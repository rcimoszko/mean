'use strict';

angular.module('fu').filter('pickName', ['$filter', '$sce', function($filter, $sce) {
    return function(pick){
        var pickName;
        switch(pick.betType){
            case 'moneyline':
                pickName = 'ML';
                if(pick.draw) pickName = 'Draw';
                break;
            case 'spread':
                pickName = 'Spread <div>' + $filter('formatSpread')(pick.spread) + '</div>';
                break;
            case 'team totals':
            case 'total points':
                pickName = pick.overUnder + '<div>' + $filter('formatPoints')(pick.points) + '</div>';
                break;
            case 'sets':
                pickName = 'Sets <div>' +  $filter('formatPoints')(pick.spread) + '</div>';
                break;
        }

        return $sce.trustAsHtml(pickName);
    };
}]);