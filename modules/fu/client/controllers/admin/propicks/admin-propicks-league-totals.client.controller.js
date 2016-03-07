'use strict';

angular.module('fu.admin').controller('AdminPropicksLeagueTotalsController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getTotalsByLeague(cb);
    }
]);
