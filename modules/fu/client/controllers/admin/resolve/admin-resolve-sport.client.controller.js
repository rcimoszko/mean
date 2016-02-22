'use strict';

angular.module('fu.admin').controller('AdminResolveSportController', ['$scope', '$stateParams', 'Sports',
    function ($scope, $stateParams, Sports) {
        $scope.sportId = $stateParams.sportId;

        function cb(err, events){
            console.log(events);
            $scope.events = events;
        }
        function cbGetSport(err, sport){
            $scope.sport = sport;
            Sports.getResolveEvents($scope.sport._id, cb);
        }

        Sports.get($scope.sportId, cbGetSport);
    }
]);
