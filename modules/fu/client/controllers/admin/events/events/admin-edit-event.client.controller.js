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
                if(err) {
                    $scope.error = err;
                } else {
                    $scope.saved = true;
                    $scope.event = event;
                }
            }
            $scope.saved = false;
            Events.update($scope.event, cb);
        };


        $scope.saveEvent = function(event){

            function cb(err, updatedEvent){
                if(err){
                    alert(err);
                } else {
                    for(var field in updatedEvent){
                        if(field.indexOf('Score') !== -1 || field === 'contestantWinner'){
                            event[field] = updatedEvent[field];
                        }
                    }
                    console.log(event);
                }
            }

            if (confirm('Are you sure you want to resolve this event?')) {
                Events.resolve(event, cb);
            }

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

        $scope.setContestants = function(event){
            $scope.contestants = [
                {name: event.contestant1.name, ref:event.contestant1.ref},
                {name: event.contestant2.name, ref:event.contestant2.ref}
            ];
        };


        $scope.setWinner = function(event){
            var found = $filter('filter')($scope.contestants, function(contestant){
                return contestant.ref === event.contestantWinner.ref;
            });
            if(found.length) event.contestantWinner =  $scope.contestants[$scope.contestants.indexOf(found[0])];
        };


    }
]);
