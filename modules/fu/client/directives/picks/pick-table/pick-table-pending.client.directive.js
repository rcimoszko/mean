'use strict';

angular.module('fu').directive('pickTablePending', function () {
    return {
        restrict: 'E',
        scope: {
            picks: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/pick-table/pick-table-pending.client.template.html',
        controller: ['$scope', function ($scope){
        }]
    };
});