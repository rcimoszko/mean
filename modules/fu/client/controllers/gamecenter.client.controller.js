'use strict';

angular.module('fu').controller('GamecenterController', ['$scope', '$stateParams', '$filter', 'Gamecenter',
    function ($scope, $stateParams, $filter, Gamecenter) {
        $scope.eventSlug = $stateParams.eventSlug;
        $scope.leagueSlug = $stateParams.leagueSlug;


        function initializeMakePicks(){
            $scope.betTypes = $scope.gamecenter.bets.betTypes;
            $scope.betDurations =  $scope.gamecenter.bets.betDurations;
            if($scope.betTypes.length) $scope.activeBetType = $scope.betTypes[0];
            if($scope.betDurations.length) $scope.activeBetDuration = $scope.betDurations[0];
            $scope.columns = $scope.betTypes.length;
            if($scope.betTypes.indexOf('team totals') !== - 1) $scope.columns++;
        }


        $scope.proActive = false;
        $scope.allActive = false;

        function initilizePicksTab(){
            if($scope.proCount > 0){
                $scope.proActive = true;
            }  else {
                $scope.proPicks = [];
                $scope.allActive = true;
            }

        }


        function cb(err, gamecenter){
            console.log(gamecenter);
            $scope.gamecenter   = gamecenter;
            $scope.consensus    = gamecenter.consensus;
            $scope.header       = gamecenter.header;
            $scope.picks        = gamecenter.picks;
            $scope.discussion   = gamecenter.discussion;
            $scope.bets         = gamecenter.bets;
            $scope.allPicks     = gamecenter.picks.general;
            $scope.proPicks     = gamecenter.picks.pro;
            $scope.proCount     = gamecenter.picks.proCount;
            $scope.proHidden     = gamecenter.picks.proHidden;
            $scope.event        = gamecenter.event;
            initializeMakePicks();
            initilizePicksTab();
        }

        Gamecenter.get($scope.eventSlug, $scope.leagueSlug, cb);

        $scope.updateActiveBetDuration = function(betDuration){
            $scope.activeBetDuration = betDuration;
        };

        $scope.setActiveBetType = function(betType){
            $scope.activeBetDuration = betType;
        };

    }
]);
