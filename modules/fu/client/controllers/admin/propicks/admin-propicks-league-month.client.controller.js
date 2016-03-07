'use strict';

angular.module('fu.admin').controller('AdminPropicksLeagueMonthController', ['$scope', 'Propicks',
    function ($scope, Propicks) {

        function cb(err, proPicks){
            $scope.proPicks = proPicks;
        }

        Propicks.getByLeague(cb);
    }
]);
