'use strict';

angular.module('fu.admin').controller('AdminPropicksAllController', ['$scope', 'Propicks',
    function ($scope, Propicks) {
        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getAll(cb);
    }
]);
