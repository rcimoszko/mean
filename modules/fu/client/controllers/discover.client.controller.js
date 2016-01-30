'use strict';

angular.module('fu').controller('DiscoverController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;

        $scope.filters = {
            sport: [{name:'All Sports', id:'all'}],
            league: [{name:'All Leagues', id:'all'}],
            team: [{name:'All Teams', id: 'all'}],
            homeAway: [
                {name:'Home/Away', id:'both'},
                {name:'Home',id:'home'},
                {name:'Away', id:'away'}
            ],
            betDuration: [
                {name: 'All Periods', id: 'all'}
            ],
            betType: [
                {name:'All Bet Types', id: 'all'}
            ],
            minBets: [
                {name: 'No Minimum Bets', id: 'all'}
            ],
            date: [
                {id : 'last7Days', name : 'Last 7 Days'},
                {id : 'last30Days', name : 'Last 30 Days'},
                {id : 'last60Days', name : 'Last 60 Days'},
                {id : 'last90Days', name : 'Last 90 Days'},
                {id : 'last6Months', name : 'Last 6 Months'},
                {id : 'lastYear', name : 'Last Year'},
                {id : 'allTime', name : 'All Time'}
            ]
        };

        $scope.filter = {
            sport: $scope.filters.sport[0],
            league: $scope.filters.league[0],
            team: $scope.filters.team[0],
            homeAway: $scope.filters.homeAway[0],
            betDuration: $scope.filters.betDuration[0],
            betType: $scope.filters.betType[0],
            minBets: $scope.filters.minBets[0],
            date: $scope.filters.date[1]
        };

        $scope.updateLeagues = function(){

        };

        $scope.updateTeams = function(){

        };

        $scope.updateLeaderboard = function(){

        };
    }

]);
