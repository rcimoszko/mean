'use strict';

angular.module('fu').controller('GamecenterController', ['$scope', '$stateParams', '$filter', 'Gamecenter', 'User', 'Page', '$location',
    function ($scope, $stateParams, $filter, Gamecenter, User, Page, $location) {
        $scope.eventSlug = $stateParams.eventSlug;
        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.location = $location;


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

        function setMetaData(){
            var separator = ' at ';
            var homeTeam;
            var awayTeam;
            if($scope.event.neutral) separator = ' vs. ';
            if($scope.event.contestant1.ref.name2){
                homeTeam = $scope.event.contestant1.ref.name2;
            } else {
                homeTeam = $scope.event.contestant1.name;
            }
            if($scope.event.contestant2.ref.name2){
                awayTeam = $scope.event.contestant2.ref.name2;
            } else {
                awayTeam = $scope.event.contestant2.name;
            }
            var date = $filter('date')($scope.event.startTime, 'MMM d y');

            Page.meta.title = homeTeam + separator + awayTeam + ' Odds, Picks, Consensus & Discussion - '+ date +' | FansUnite';
            Page.meta.description =  'Up-to-date odds, free picks, community consensus and betting discussion for '+$scope.event.contestant1.name+' vs. '+$scope.event.contestant2.name+' ('+ date + ').';
            Page.meta.keywords = $scope.event.contestant1.name+', '+$scope.event.contestant2.name+', odds, betting discussion, free tips, pro picks, consensus';
        }


        function cb(err, gamecenter){
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
            $scope.generalCount  = gamecenter.picks.generalCount;
            $scope.generalHidden = gamecenter.picks.generalHidden;
            $scope.event        = gamecenter.event;
            setMetaData();
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
