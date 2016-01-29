'use strict';

angular.module('fu').directive('pickTableCompleted', function () {
    return {
        restrict: 'E',
        scope: {
            picks: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-table/pick-table-completed.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});