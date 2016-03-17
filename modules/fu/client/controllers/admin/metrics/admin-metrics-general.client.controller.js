'use strict';

angular.module('fu.admin').controller('AdminMetricsGeneralController', ['$scope', '$filter', 'Metrics',
    function ($scope, $filter, Metrics) {
        var query = {dateType:'daily'};

        function cb(err, metrics){
            $scope.metrics = metrics;
        }

        Metrics.getGeneral(query, cb);

        $scope.getDate = function(date){
            return  $filter('date')(new Date(date.year, date.month, date.day), 'short');
        }
    }
]);
