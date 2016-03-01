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
            Page.meta.title = $scope.event.contestant1.name +' vs. '+$scope.event.contestant2.name+' | Odds, Score and Consensus';
            Page.meta.description = 'Find expert picks and the most up to date odds for '+$scope.event.contestant1.name +' vs. '+$scope.event.contestant2.name+' - '+new Date($scope.event.startTime).toDateString();
            Page.meta.keywords = $scope.event.contestant1.name+', '+$scope.event.contestant2.name+', odds, scores, free bets';
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
