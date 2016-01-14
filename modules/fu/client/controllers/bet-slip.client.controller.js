'use strict';

angular.module('fu').controller('BetSlipController', ['$scope', 'BetSlip', '$rootScope', '$location', 'Loading',
    function ($scope, BetSlip, $rootScope, $location, Loading) {
        $scope.betSlip = BetSlip;
        $scope.loading = Loading;
        $scope.isPicksPage = $location.url().indexOf('make-picks') !== -1;

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                $scope.isPicksPage =  toState.name.indexOf('makePicks') !== -1;
            });

        $scope.events = BetSlip.events;

        $scope.submitPicks = function(){
            function cb(err, results){
                if(err){

                }


            }
            $scope.betSlip.submit(cb);

        };

    }
]);
