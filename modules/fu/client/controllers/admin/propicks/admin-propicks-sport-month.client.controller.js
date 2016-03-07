'use strict';

angular.module('fu.admin').controller('AdminPropicksSportMonthController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getBySport(cb);
    }
]);
