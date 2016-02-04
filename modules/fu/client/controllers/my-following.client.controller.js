'use strict';

angular.module('fu').controller('MyFollowingController', ['$scope', 'User', 'Sports', '$filter', 'Trending',
    function ($scope, User, Sports, $filter, Trending) {
        $scope.filters = {};

        $scope.filters = {
            sports: [
                {name:'All Sports', _id:'all'}
            ],
            leagues: [
                {name:'All Leagues', _id:'all'}
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
            date:        $scope.filters.dates[1]
        };

        function cbGetSports(err, sports){
            $scope.filters.sports = $scope.filters.sports.concat(sports);
        }

        Sports.getAll(cbGetSports);
        var followingList = [];

        function cbGetFollowing(err, following){
            $scope.followingLeaderboard = following;
            followingList = following.concat([]);
            updateList();
        }

        $scope.updateFollowing = function(){
            var query = {
                dateId:  $scope.filter.date.id,
                sportId:  $scope.filter.sport._id,
                leagueId: $scope.filter.league._id
            };
            User.getFollowing(query, cbGetFollowing);
        };
        $scope.updateFollowing();

        $scope.updateLeagues = function(){
            function cb(err, leagues){
                $scope.filters.leagues = [{name:'All Leagues', _id:'all'}];
                $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
                var selectedLeague = $filter('filter')($scope.filters.leagues, function(league){
                    return league._id === $scope.filter.league._id;
                });
                if(selectedLeague.length){
                    $scope.filter.league =  $scope.filters.leagues[$scope.filters.leagues.indexOf(selectedLeague[0])];
                } else {
                    $scope.filter.league = $scope.filters.leagues[0];
                }
            }

            if($scope.filter.sport._id !== 'all'){
                var sportId =  $scope.filter.sport._id;
                Sports.getLeagues(sportId, cb);
            }
        };



        $scope.order = 'profit';
        $scope.updateOrder = function(field){
            $scope.order = field;
        };

        $scope.currentOrder = function(user){
            return -user[$scope.order];
        };

        $scope.limitOn = true;
        $scope.toggleLimit = function(){
            $scope.limitOn = !$scope.limitOn;
        };

        $scope.limit = function(){
            if($scope.limitOn) return 5;
            return 9999999;
        };

        $scope.madePicks = true;
        $scope.hasPicks = true;

        var madePicksFilter = function(user){
            return user.profit !== 0;
        };
        var hasPicksFilter = function(user){
            return user.eventPicks.length > 0;
        };

        function updateList(){
            var list = followingList.concat([]);
            if($scope.madePicks) list = $filter('filter')(list, madePicksFilter);
            if($scope.hasPicks) list = $filter('filter')(list, hasPicksFilter);
            $scope.followingList = list;
        }

        $scope.toggleHasPicks = function(){
            $scope.hasPicks = !$scope.hasPicks;
            updateList();
        };

        $scope.toggleMadePicks = function(){
            $scope.madePicks = !$scope.madePicks;
            updateList();
        };

        $scope.updateTrending = function(){
            var query = {
                sportId: $scope.filter.sport._id,
                leagueId: $scope.filter.league._id,
                dateId: $scope.filter.date.id
            };
            function cb(err, trending){
                console.log(trending);
                $scope.trending = trending;
            }

            Trending.get(query, cb);
        };

        $scope.updateTrending();

    }
]);
