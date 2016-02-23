'use strict';

angular.module('fu.admin').controller('AdminResolveSportController', ['$scope', '$stateParams', 'Sports', 'Events',
    function ($scope, $stateParams, Sports, Events) {
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
                if(err){
                    alert(err);
                } else {
                    event = updatedEvent;
                }
            }

            if (confirm('Are you sure you want to resolve this event?')) {
               Events.resolve(event, cb);
            }

        };


    }
]);
