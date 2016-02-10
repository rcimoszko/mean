'use strict';

angular.module('fu').filter('formatResult', [ function() {
    return function(result) {
        var resultText;

        switch(result){
            case 'Win':
                resultText = 'w';
                break;
            case 'Loss':
                resultText = 'l';
                break;
            case 'Push':
                resultText = 'p';
                break;
            case 'Cancelled':
                resultText = 'c';
                break;
            case 'Half-Win':
                resultText = 'hw';
                break;
            case 'Half-Loss':
                resultText = 'hl';
                break;
        }

        return resultText;
    };
}]);
