'use strict';

angular.module('fu').directive('consensusPick', function () {
    return {
        restrict: 'E',
        scope: {
            consensusPick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/consensus-pick.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});