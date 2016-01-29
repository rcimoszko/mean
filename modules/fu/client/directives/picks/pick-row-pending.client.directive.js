'use strict';

angular.module('fu').directive('pickRowPending', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-row/pick-row-pending.client.template.html',
        controller: ['$scope', function ($scope){
            console.log($scope.pick);
        }]
    };
});