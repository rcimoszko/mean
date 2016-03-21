'use strict';

angular.module('fu.admin').controller('AdminMetricsGeneralController', ['$scope', '$filter', 'Metrics',
    function ($scope, $filter, Metrics) {

        $scope.dates = ['daily', 'weekly', 'monthly'];
        $scope.date = $scope.dates[0];

        $scope.getMetrics = function(){

            var query = {dateType:$scope.date};

            function cb(err, metrics){
                $scope.metrics = metrics;
            }

            Metrics.getGeneral(query, cb);
        };

        $scope.getMetrics();

    }
]);
