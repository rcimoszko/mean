'use strict';

angular.module('fu.admin').controller('AdminMetricsEngagementController', ['$scope', 'Metrics',
    function ($scope, Metrics) {
        var query = {dateType:'daily'};

        function cb(err, metrics){
            console.log(metrics);
            $scope.metrics = metrics;
        }

        Metrics.getEngagement(query, cb);
    }
]);
