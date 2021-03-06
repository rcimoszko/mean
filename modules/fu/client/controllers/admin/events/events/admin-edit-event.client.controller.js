'use strict';

angular.module('fu.admin').controller('AdminEditEventController', ['$scope', 'eventResolve', 'Events', 'Picks', '$state', '$filter',
    function ($scope, eventResolve, Events, Picks, $state, $filter) {
        $scope.event = eventResolve;

        //Setup for table
        $scope.event.$promise.then(function(event) {
            $scope.events = [{count:0, event: event}];

            $scope.sportSlug = $filter('slugify')(event.sport.name);
            $scope.getPicks();

        });

        $scope.getPicks = function(){

            function cbGetPicks(err, picks){
                $scope.picks = picks;
                $scope.events[0].count = picks.length;
            }

            Events.getPicks($scope.event, cbGetPicks);
        };

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


        $scope.isNCAAB = function(event){
            return event.event.league.name === 'NCAAB';
        };
        $scope.isNotNCAAB = function(event){
            return event.event.league.name !== 'NCAAB';
        };
        $scope.isDotaOrLeague = function(event){
            if(event.event.league.ref.group){
                return event.event.league.ref.group.name === 'League of Legends' || event.event.league.ref.group.name === 'Dota 2';
            }
        };
        $scope.isCsGo = function(event){
            if(event.event.league.ref.group) {
                return event.event.league.ref.group.name === 'CS:GO';
            }
        };
        $scope.isStarcraft = function(event){
            if(event.event.league.ref.group) {
                return event.event.league.ref.group.name === 'Starcraft 2';
            }
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
                    $scope.setWinner(updatedEvent);
                    $scope.getPicks();
                }
            }

            if (confirm('Are you sure you want to resolve this event?')) {
                Events.resolve(event, cb);
            }
        };

        $scope.cancelEvent = function(event){

            function cb(err, updatedEvent){
                if(err){
                    alert(err);
                } else {
                    $scope.getPicks();
                }
            }

            if (confirm('Are you sure you want cancel this event?')) {
                Events.cancel(event, cb);
            }
        };
        

        $scope.boxingMethodOfVictory = ['Decision', 'Knockout', 'Draw', 'Disqualification', 'No Contest'];
        $scope.mmaMethodOfVictory = ['Decision', 'Knockout', 'Submission', 'Draw', 'Disqualification', 'No Contest'];


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
                undefined,
                {name: event.contestant1.name, ref:event.contestant1.ref},
                {name: event.contestant2.name, ref:event.contestant2.ref}
            ];
            return $scope.contestants;
        };


        $scope.setWinner = function(event){
            console.log(event);
            if(event.contestantWinner) {
                var found = $filter('filter')($scope.contestants, function (contestant) {
                    if(contestant) return contestant.ref === event.contestantWinner.ref;
                });
                console.log(found);
                if (found.length) $scope.event.contestantWinner = $scope.contestants[$scope.contestants.indexOf(found[0])];
            }
        };


    }
]);
