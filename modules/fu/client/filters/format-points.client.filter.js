'use strict';

angular.module('core').filter('formatPoints', function(){
    return function(points, overUnder){
        if(!isNaN(points)){
            var value = points % 1;
            var pointsText;
            if (Math.abs(value) === 0.75 || Math.abs(value) === 0.25){
                var points1 = points - 0.25;
                var points2 = points + 0.25;
                points1 = points1.toFixed(1);
                points2 = points2.toFixed(1);
                if (value < 0){
                    pointsText = points2+ ', ' + points1;
                } else {
                    pointsText = points1+ ', ' + points2;
                }

            } else {
                points = points.toFixed(1);
                pointsText = overUnder[0] + ' ' + points;
            }
            return pointsText;
        }
    };
});