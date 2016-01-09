'use strict';

angular.module('core').filter('formatSpread', function(){
    return function(spread){
        if(!isNaN(spread) && spread !== null){
            var value = spread % 1;
            var spreadText;
            if (Math.abs(value) === 0.75 || Math.abs(value) === 0.25){
                var spread1 = spread - 0.25;
                var spread2 = spread + 0.25;
                spread1 = spread1.toFixed(1);
                spread2 = spread2.toFixed(1);
                if(spread1 > 0){
                    spread1 = '+'+spread1;
                }
                if(spread2 > 0){
                    spread2 = '+'+spread2;
                }
                if (value < 0){
                    spreadText = spread2+ ', ' + spread1;
                } else {
                    spreadText = spread1+ ', ' + spread2;
                }

            } else {
                spread = spread.toFixed(1);
                if(spread> 0){
                    spread = '+'+spread;
                }
                spreadText = spread;
            }
            return spreadText;
        }
    };
});