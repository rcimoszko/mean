'use strict';

angular.module('fu.admin').controller('AdminPropicksSportTotalsController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getTotalsBySport(cb);
    }
]);
