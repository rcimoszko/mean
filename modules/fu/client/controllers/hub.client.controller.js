'use strict';

angular.module('fu').controller('HubController', ['$scope', 'Authentication', 'Hub',
    function ($scope, Authentication, Hub) {
        $scope.authentication = Authentication;


        function cbGetHub(err, hub){
            $scope.hub = hub;
        }

        Hub.getHub(cbGetHub);



        $scope.picks = {
            pending: [],
            completed: []
        };

        $scope.pages = {
            pending: 0,
            completed: 0
        };

        $scope.pickFilters = ['pending', 'completed'];
        $scope.pickFilter = $scope.pickFilters[0];
        $scope.setPickFilter = function(pickFilter){
            $scope.pickFilter = pickFilter;
        };


        $scope.getPicks = function(){
            function cbGetPicks(err, picks){
                console.log(picks);
                $scope.picks[$scope.pickFilter] = $scope.picks[$scope.pickFilter].concat(picks);
                $scope.pages[$scope.pickFilter]++;
            }

            var query = {
                page: $scope.pages[$scope.pickFilter],
                type: $scope.pickFilter
            };

            Hub.getPicks(query, cbGetPicks);
        };

        $scope.getPicks();

    }
]);
