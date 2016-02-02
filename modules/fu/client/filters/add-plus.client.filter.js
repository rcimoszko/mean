'use strict';

angular.module('fu').filter('addPlus', function() {
    return function(value) {
        if(value > 0){
            return '+' + value;
        } else {
            return value;
        }
    };
});

