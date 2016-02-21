'use strict';

angular.module('fu').controller('GamecenterController', ['$scope', '$stateParams', '$filter', 'Gamecenter', 'User',
    function ($scope, $stateParams, $filter, Gamecenter, User) {
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

        $scope.followingPicks = [];
        function initializeFollowingPicks(){
            var allPicks =  $scope.allPicks.concat($scope.proPicks);
            $scope.followingPicks = $filter('filter')(allPicks, function(pick){
                var following = $filter('filter')(User.info.following, function(following){
                    return pick.user.ref._id === following._id;
                });
                return following.length;
            });
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
            $scope.proHidden    = gamecenter.picks.proHidden;
            $scope.event        = gamecenter.event;
            initializeFollowingPicks();
            initializeMakePicks();
            initilizePicksTab();
        }

        Gamecenter.get($scope.eventSlug, $scope.leagueSlug, cb);

        $scope.updateActiveBetDuration = function(betDuration){
            $scope.activeBetDuration = betDuration;
        };

        $scope.setActiveBetType = function(betType){
            $scope.activeBetType = betType;
        };

    }
]);
