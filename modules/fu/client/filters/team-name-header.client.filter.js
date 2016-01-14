'use strict';

angular.module('fu').filter('teamNameHeader',[function() {
    return function(event) {
        var separator = ' @ ';
        if(event.neutral) event.separator = ' vs. ';
        return event.contestant1.name + separator + event.contestant2.name;
    };
}]);