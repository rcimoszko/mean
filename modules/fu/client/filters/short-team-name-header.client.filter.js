'use strict';

angular.module('fu').filter('shortTeamNameHeader',[function() {
    return function(event) {
        var separator = ' @ ';
        if(event.neutral) event.separator = ' vs. ';
        if(event.contestant1.name2 && event.contestant2.name2){
            return event.contestant2.name2 + separator + event.contestant1.name2;
        } else {
            return event.contestant2.name + separator + event.contestant1.name;
        }
    };
}]);