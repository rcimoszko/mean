'use strict';

angular.module('fu').directive('areaChart', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/charts/area-chart.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});