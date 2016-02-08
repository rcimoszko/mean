'use strict';

angular.module('fu').controller('HubController', ['$scope', 'Authentication', 'Hub',
    function ($scope, Authentication, Hub) {
        $scope.authentication = Authentication;


        $scope.pickFilters = ['pending', 'in-play', 'completed'];
        $scope.pickFilter = $scope.pickFilters[0];
        $scope.setPickFilter = function(pickFilter){
            $scope.pickFilter = pickFilter;
        };


        function cb(err, hub){
            console.log(hub);
            $scope.hub = hub;
        }

        Hub.getHub(cb);

        //hub all picks

        //hub/picks
        //hub/trending

        //hub/propicks
        //hub/consensus
        //hub/hotpick
        //hub/populargames
        //hub/discussion



    }
]);
