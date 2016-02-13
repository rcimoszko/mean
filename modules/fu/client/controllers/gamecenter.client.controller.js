'use strict';

angular.module('fu').controller('GamecenterController', ['$scope', '$stateParams', '$filter', 'Gamecenter',
    function ($scope, $stateParams, $filter, Gamecenter) {
        $scope.eventSlug = $stateParams.eventSlug;
        $scope.leagueSlug = $stateParams.leagueSlug;

        function cb(err, gamecenter){
            console.log(gamecenter);
            $scope.gamecenter = gamecenter;
        }

        Gamecenter.get($scope.eventSlug, $scope.leagueSlug, cb);

    }
]);
