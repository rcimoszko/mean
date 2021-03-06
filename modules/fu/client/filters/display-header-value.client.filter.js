'use strict';

angular.module('fu').filter('displayHeaderValue',['$filter', function($filter) {
    return function(value, type) {
        var displayValue;
        switch(type){
            case 'spread':
                displayValue = $filter('formatSpread')(value);
                break;
            case 'total points':
                displayValue = 'o'+$filter('formatPoints')(value);
                break;
            case 'odds':
                displayValue = $filter('formatOdds')(value);
                break;
        }
        return displayValue;
    };
}]);