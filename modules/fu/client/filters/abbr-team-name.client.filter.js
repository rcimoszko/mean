'use strict';

angular.module('fu').filter('abbrTeamName',[function() {
    return function(contestant) {
        if(contestant.abbreviation){
            return contestant.abbreviation;
        } else {
            return contestant.name.substring(0,3).toUpperCase();
        }
    };
}]);