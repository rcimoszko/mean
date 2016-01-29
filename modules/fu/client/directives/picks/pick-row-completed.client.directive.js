'use strict';

angular.module('fu').directive('pickRowCompleted', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-row/pick-row-completed.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});