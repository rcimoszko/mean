'use strict';

angular.module('fu').filter('pointName', function(){
    return function(event){
        if(event){
            switch(event.sport.name){
                case 'Hockey':
                case 'Soccer':
                    return 'Goals';
                case 'Boxing':
                case 'Mixed Martial Arts':
                    return 'Rounds';
                case 'Baseball':
                    return 'Runs';
                case 'Tennis':
                    return 'Games';
                case 'Volleyball':
                    return 'Sets';
                default:
                    return 'Points';
            }
        }
    };
});