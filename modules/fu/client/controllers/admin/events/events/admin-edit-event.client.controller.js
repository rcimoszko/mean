'use strict';

angular.module('fu.admin').controller('AdminEditEventController', ['$scope', 'eventResolve', 'Events', 'Picks', '$state', '$filter',
    function ($scope, eventResolve, Events, Picks, $state, $filter) {
        $scope.event = eventResolve;

        //Setup for table
        $scope.event.$promise.then(function(event) {

            $scope.events = [{count:0, event: event}];

            function cbGetPicks(err, picks){
                $scope.picks = picks;
                $scope.events[0].count = picks.length;
            }

            Events.getPicks(event, cbGetPicks);
            $scope.sportSlug = $filter('slugify')(event.sport.name);

        });

        $scope.submit = function(){
            function cb(err, event){
                if(err){
                    $scope.error = err;
                    $state.go('admin.events');
                } else{
                    $scope.event = event;
                }
            }
            Events.update($scope.event, cb);
        };

        $scope.results = ['Pending', 'Win', 'Loss', 'Push', 'Cancelled', 'Half-Win', 'Half-Loss'];

        $scope.savePick = function(pick){
            function cb(err, updatedPick){
                pick.profit = updatedPick.profit;
                pick.roi = updatedPick.roi;
                pick.result = updatedPick.result;
            }
            Picks.resolve(pick, cb);
        };
    }
]);
