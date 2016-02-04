'use strict';

angular.module('fu').directive('eventPickList', function () {
    return {
        restrict: 'E',
        scope: {
            events: '=',
            includeUser: '='
        },
        templateUrl: 'modules/fu/client/templates/user-picks/event-pick-list.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});