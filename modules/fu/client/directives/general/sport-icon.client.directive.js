'use strict';

angular.module('core').directive('sportIcon', function(){
    return {
        restrict: 'E',
        scope: {
            url: '=',
            color: '='
        },
        templateUrl: '/modules/fu/client/templates/general/sport-icon.client.template.html',
        controller: ['$scope', function($scope){

        }]
    };
});


