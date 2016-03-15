'use strict';

angular.module('fu.admin').controller('AdminResolveSportController', ['$scope', '$stateParams', 'Sports', 'Events', '$filter',
    function ($scope, $stateParams, Sports, Events, $filter) {
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

        /**
         *  Filters
         */

        $scope.isNCAAB = function(event){
            return event.event.league.name === 'NCAAB';
        };
        $scope.isNotNCAAB = function(event){
            return event.event.league.name !== 'NCAAB';
        };
        $scope.isDotaOrLeague = function(event){
            console.log(event.event.league.ref);
            if(event.event.league.ref.group){
                return event.event.league.ref.group.name === 'League of Legends' || event.event.league.ref.group.name === 'Dota 2';
            }
        };
        $scope.isCsGo = function(event){
            return event.event.league.ref.group.name === 'CS:GO';
        };
        $scope.isStarcraft = function(event){
            return event.event.league.ref.group.name === 'Starcraft 2';
        };

        /**
         * Boxing/MMA
         */

        $scope.boxingMethodOfVictory = ['Decision', 'Knockout', 'Draw', 'Disqualification', 'No Contest'];
        $scope.mmaMethodOfVictory = ['Decision', 'Knockout', 'Submission', 'Draw', 'Disqualification', 'No Contest'];


        $scope.cancelEvent = function(event){
            function cb(err, updatedEvent){
                if(err){
                    alert(err);
                } else {
                    event = updatedEvent;
                }
            }

            if (confirm('Are you sure you want to cancel this event?')) {
                Events.cancel(event, cb);
            }
        };


        $scope.saveEvent = function(event){

            function cb(err, updatedEvent){
                console.log(updatedEvent);
                if(err){
                    alert(err);
                } else {
                    for(var field in updatedEvent){
                        if(field.indexOf('Score') !== -1 || field === 'contestantWinner'){
                            event[field] = updatedEvent[field];
                        }
                    }
                }
            }

            if (confirm('Are you sure you want to resolve this event?')) {
               Events.resolve(event, cb);
            }

        };

        $scope.setContestants = function(event){
            return [
                undefined,
                {name: event.contestant1.name, ref:event.contestant1.ref},
                {name: event.contestant2.name, ref:event.contestant2.ref}
            ];
        };

        $scope.setWinner = function(contestants, event){
            if(event.contestantWinner) {
                var found = $filter('filter')(contestants, function (contestant) {
                    if(contestant) return contestant.ref === event.contestantWinner.ref;
                });
                if (found.length) event.contestantWinner = contestants[contestants.indexOf(found[0])];
            }
        };
    }
]);
