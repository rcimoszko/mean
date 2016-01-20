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
                for(var j=0; j<values.length; j++){
                    if(values[j].eventId === $scope.events[i].event._id){
                        for(var k=0; k<$scope.events[i].picks.length; k++){
                            if( $scope.events[i].picks[k]._id === values[j].betId){
                                $scope.events[i].picks[k].error = true;
                                if('odds' in values[j]){
                                    $scope.events[i].picks[k].odds = values[j].odds;
                                    $scope.events[i].picks[k].oddsChanged = true;
                                }
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
            console.log(err);
            switch (err.type){
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
