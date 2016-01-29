'use strict';

angular.module('fu').filter('pickReturn', function() {
    return function(pick){
        return (pick.odds* pick.units).toFixed(1);
    };
});