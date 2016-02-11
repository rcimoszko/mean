'use strict';

angular.module('fu').filter('teamNameHeader',[function() {
    return function(event) {
        var separator = ' @ ';
        if(event.neutral) event.separator = ' vs. ';
        return event.contestant2.name + separator + event.contestant1.name;
    };
}]);