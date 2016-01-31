'use strict';

angular.module('fu').controller('DiscoverController', ['$scope', '$stateParams', '$state', 'Authentication', 'Leaderboard',
    function ($scope, $stateParams, $state, Authentication, Leaderboard) {
        $scope.authentication   = Authentication;
        $scope.sportSlug        = $stateParams.sportSlug;
        $scope.leagueSlug       = $stateParams.leagueSlug;
        $scope.contestantSlug   = $stateParams.contestantSlug;

        $scope.filters = {
            sports: [
                {name:'All Sports', _id:'all'}
            ],
            leagues: [
                {name:'All Leagues', _id:'all'}
            ],
            contestants: [
                {name:'All Teams', _id: 'all'}
            ],
            homeAway: [
                {name:'Home/Away', id:'both'},
                {name:'Home',id:'home'},
                {name:'Away', id:'away'}
            ],
            betDurations: [
                {name: 'All Periods', id: 'all'}
            ],
            betTypes: [
                {name:'All Bet Types', id: 'all'}
            ],
            minBets: [
                {name: 'No Minimum Picks', id: 'all'},
                {name: '100 picks', id: 100},
                {name: '50 picks', id: 50},
                {name: '30 picks', id: 30},
                {name: '10 picks', id: 10},
            ],
            dates: [
                {id : 'last7Days',  name : 'Last 7 Days'},
                {id : 'last30Days', name : 'Last 30 Days'},
                {id : 'last60Days', name : 'Last 60 Days'},
                {id : 'last90Days', name : 'Last 90 Days'},
                {id : 'last6Months', name : 'Last 6 Months'},
                {id : 'lastYear', name : 'Last Year'},
                {id : 'allTime', name : 'All Time'}
            ]
        };

        $scope.filter = {
            sport:       $scope.filters.sports[0],
            league:      $scope.filters.leagues[0],
            contestant:  $scope.filters.contestants[0],
            homeAway:    $scope.filters.homeAway[0],
            betDuration: $scope.filters.betDurations[0],
            betType:     $scope.filters.betTypes[0],
            minBets:     $scope.filters.minBets[0],
            date:        $scope.filters.dates[1]
        };

        $scope.sportChange = function(){

            $state.go('discover.sport', {sportSlug: $scope.filter.sport.slug});

            function cb(err, leagues){
                $scope.filters.leagues = [{name:'All Leagues', _id:'all'}];
                $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
                $scope.filter.league = $scope.filters.leagues[0];
            }

            var sportId =  $scope.filter.sport._id;
            var dateId = $scope.filter.date.id;

            Leaderboard.getLeagues(sportId, dateId, cb);
        };

        $scope.leagueChange = function(){
            $state.go('discover.league', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug});

            function cb(err, contestants){
                $scope.filters.contestants = [{name:'All Teams', _id:'all'}];
                $scope.filters.contestants = $scope.filters.contestants.concat(contestants);
                $scope.filter.contestant = $scope.filters.contestants[0];
            }

            var leagueId =  $scope.filter.league._id;

            Leaderboard.getContestants(leagueId, cb);

        };

        $scope.contestantChange = function(){
            $state.go('discover.contestant', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug, contestant: $scope.filter.contestant.slug});
        };

        $scope.updateLeaderboard = function(){

        };

        function cbGetSports(err, sports){
            $scope.filters.sports = $scope.filters.sports.concat(sports);
        }

        Leaderboard.getSports(cbGetSports);

    }

]);
