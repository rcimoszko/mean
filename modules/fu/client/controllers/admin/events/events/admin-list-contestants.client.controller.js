'use strict';

angular.module('fu.admin').controller('AdminListEventsController', ['$scope', 'Sports', 'Leagues',
    function ($scope, Sports, Leagues) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.getLeagues = function(){
            function cb(err, leagues){
                $scope.leagues = leagues;
            }
            Sports.getLeagues($scope.sport._id, cb);
        };

        $scope.page = 0;

        $scope.getLeagueEvents = function(){
            function cb(err, Events){
                $scope.Events = Events;
            }
            Leagues.getEvents($scope.league._id, $scope.page, cb);
        };
    }
]);
