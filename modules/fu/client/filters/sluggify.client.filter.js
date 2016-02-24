'use strict';

angular.module('fu').filter('slugify',[function() {
    return function(event) {
        return event
            .toLowerCase()
            .replace(/ /g,'-')
            .replace(/[^\w-]+/g,'');
    };
}]);