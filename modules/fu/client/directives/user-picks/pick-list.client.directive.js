'use strict';

angular.module('fu').directive('pickList', function () {
    return {
        restrict: 'E',
        scope: {
            picks: '=',
            event: '=',
            includeUser: '='
        },
        templateUrl: 'modules/fu/client/templates/user-picks/pick-list.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});