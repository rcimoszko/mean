'use strict';

angular.module('fu').controller('MakePicksController', ['$scope', 'Authentication', 'MakePicks',
    function ($scope, Authentication, MakePicks) {
        $scope.authentication = Authentication;

        function cbGetMenu(err, menu){
            if(!err)$scope.menu = menu;
        }
        MakePicks.getMenu(cbGetMenu);


        $scope.query = {};

        function getPicks(){
            function cbGetPicks(err, picks){
                if(!err) $scope.picks = picks;
            }

            MakePicks.getPicks($scope.query, cbGetPicks);
        }


        $scope.getPicks = function(sport, league){
            $scope.query = {sport:sport, league:league};
            getPicks();
        };

    }
]);
