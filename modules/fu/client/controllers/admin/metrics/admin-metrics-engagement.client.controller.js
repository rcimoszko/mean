'use strict';

angular.module('fu.admin').controller('AdminMetricsEngagementController', ['$scope', 'Metrics',
    function ($scope, Metrics) {

        $scope.dates = ['daily', 'weekly', 'monthly'];
        $scope.date = $scope.dates[0];

        $scope.getMetrics = function(){

            var query = {dateType:$scope.date};

            function cb(err, metrics){
                $scope.metrics = metrics;
            }

            Metrics.getEngagement(query, cb);
        };

        $scope.getMetrics();
    }
]);
