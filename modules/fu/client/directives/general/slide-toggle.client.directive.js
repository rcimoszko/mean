'use strict';

angular.module('core').directive('slideToggle', function() {
    return {
        restrict: 'A',
        scope:{
            isOpen: '=slideToggle'
        },
        link: function(scope, element, attr) {
            var slideDuration = parseInt(attr.slideToggleDuration, 10) || 200;
            scope.$watch('isOpen', function(newVal,oldVal){
                if(newVal !== oldVal){
                    if(newVal === true){
                        element.stop().slideDown(slideDuration);
                    } else {
                        element.stop().slideUp(slideDuration);
                    }
                    //element.stop().slideToggle(slideDuration);
                }
            });
        }
    };
});