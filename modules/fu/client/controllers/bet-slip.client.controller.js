'use strict';

angular.module('fu').controller('BetSlipController', ['$scope', 'BetSlip', '$rootScope', '$location', 'Loading', 'Modal',
    function ($scope, BetSlip, $rootScope, $location, Loading, Modal) {
        $scope.betSlip = BetSlip;
        $scope.loading = Loading;
        $scope.show = false;
        $scope.isPicksPage = $location.url().indexOf('make-picks') !== -1;

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $scope.isPicksPage =  toState.name.indexOf('makePicks') !== -1;
            });

        $scope.events = BetSlip.events;

        function highlightPicks(values){
            for(var i=0; i<$scope.events.length; i++){
                for(var j=0; j<$scope.events[i].picks.length; j++){
                    var pick = $scope.events[i].picks[j];
                    for(var k=0; k<values.length; k++){
                        if(pick._id === values[j].betId){
                            pick.error = true;
                            if('odds' in values[j]){
                                pick.odds = values[j].odds;
                                pick.oddsChanged = true;
                            }
                        }
                    }
                }
            }
        }

        function highlightEvents(values){
            for(var i=0; i<$scope.events.length; i++){
                for(var j=0; j<values.length; j++){
                    if(values[j].eventId === $scope.events[i].event._id){
                        $scope.events[i].error = true;
                    }
                }
            }
        }


        function handleError(err){
            $scope.errorMessage = err.message;
            $scope.betSlip.status.error = true;
            $scope.betSlip.status.submitted = false;

            switch (err.type){
                case 'invalid units':
                    highlightPicks(err.values);
                    break;
                case 'units':
                    break;
                case 'started':
                    highlightEvents(err.values);
                    break;
                case 'changed':
                    highlightPicks(err.values);
                    break;
                case 'duplicate':
                    highlightPicks(err.values);
                    break;
            }
        }



        $scope.submitPicks = function(){

            $scope.betSlip.status.error = false;
            $scope.betSlip.status.submitted = false;
            $scope.errorMessage = null;

            function cb(err){
                if(err) handleError(err);


            }

            Modal.showModal(
                '/modules/fu/client/views/make-picks/modal/modal-make-picks-confirm.client.view.html',
                'ModalMakePicksConfirmController',
                {
                    submitCallback: function () {
                        return cb;
                    }
                },
                'prompt'
            );

        };

        $scope.toggleShow = function(){
            $scope.show = !$scope.show;
        };

    }
]);
