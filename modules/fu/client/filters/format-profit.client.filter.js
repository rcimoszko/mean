'use strict';

angular.module('fu').filter('formatProfit', function() {
    return function(profit) {
        return profit.toFixed(1);
    };
});

