'use strict';

angular.module('fu').directive('areaChart', function () {
    return {
        restrict: 'E',
        scope: {
            data: '=',
            height: '='
        },
        templateUrl: 'modules/fu/client/templates/charts/area-chart.client.template.html',
        controller: ['$scope', 'Charts', function ($scope, Charts){
            $scope.chart = Charts.createChart('area', $scope.data);
        }]
    };
});