'use strict';

angular.module('fu').filter('formatRoi', function() {
    return function(profit) {
        return profit.toFixed(1)+'%';
    };
});

