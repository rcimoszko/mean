'use strict';

angular.module('fu').factory('Keywords', [
    function() {

        var getCapperText = function(sportName, capitalize){
            var capperText = 'tipsters';
            switch(sportName){
                case 'Baseball':
                case 'Basketball':
                case 'Hockey':
                case 'Football':
                case 'Curling':
                case 'Mixed Martial Arts':
                case 'Boxing':
                    capperText = 'handicappers';
                    break;
            }

            if(capitalize) capperText = capperText.charAt(0).toUpperCase() + capperText.slice(1);
            return capperText;

        };


        var getPicksText = function(sportName, capitalize){
            var picksText = 'tips';
            switch(sportName){
                case 'Baseball':
                case 'Basketball':
                case 'Hockey':
                case 'Football':
                case 'Curling':
                case 'Mixed Martial Arts':
                case 'Boxing':
                    picksText = 'picks';
                    break;
            }

            if(capitalize) picksText = picksText.charAt(0).toUpperCase() + picksText.slice(1);
            return picksText;

        };

        return {
            getCapperText: getCapperText,
            getPicksText: getPicksText
        };
    }
]);