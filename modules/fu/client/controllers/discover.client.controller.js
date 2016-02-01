'use strict';

angular.module('fu').controller('DiscoverController', ['$scope', '$stateParams', '$state', '$filter', 'Authentication', 'Leaderboard',
    function ($scope, $stateParams, $state, $filter, Authentication, Leaderboard) {
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
                var dateId = $scope.filter.date.id;
                Leaderboard.getLeagues(sportId, dateId, cb);
            }
        };

        $scope.sportChange = function(){
            updateBetTypes();
            updateBetDurations();

            function cb(err, leagues){
                $scope.filters.leagues = [{name:'All Leagues', _id:'all'}];
                $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
                $scope.filter.league = $scope.filters.leagues[0];
            }

            if($scope.filter.sport._id === 'all') {
                $state.go('discover.home');
            } else {
                $state.go('discover.sport', {sportSlug: $scope.filter.sport.slug});
                $scope.filter.contestant = $scope.filters.contestants[0];
                var sportId =  $scope.filter.sport._id;
                var dateId = $scope.filter.date.id;

                Leaderboard.getLeagues(sportId, dateId, cb);
            }


        };

        $scope.leagueChange = function(){
            updateBetTypes();
            updateBetDurations();

            function cb(err, contestants){
                $scope.filters.contestants = [{name:'All Teams', _id:'all'}];
                $scope.filters.contestants = $scope.filters.contestants.concat(contestants);
                $scope.filter.contestant = $scope.filters.contestants[0];
            }

            if($scope.filter.league._id === 'all'){
                $state.go('discover.sport', {sportSlug: $scope.filter.sport.slug});
            } else {
                $state.go('discover.league', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug});
                var leagueId =  $scope.filter.league._id;
                Leaderboard.getContestants(leagueId, cb);
            }
        };

        $scope.contestantChange = function(){
            if($scope.filter.contestant._id === 'all') {
                $state.go('discover.league', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug});
            } else {
                $state.go('discover.contestant', {sportSlug: $scope.filter.sport.slug, leagueSlug: $scope.filter.league.slug, contestantSlug: $scope.filter.contestant.slug});
            }
        };

        $scope.updateLeaderboard = function(){

            var query = {
                dateId:  $scope.filter.date.id,
                sportId:  $scope.filter.sport._id,
                leagueId: $scope.filter.league._id,
                contestantId: $scope.filter.contestant._id,
                homeAway: $scope.filter.homeAway.id,
                betDuration: $scope.filter.betDuration.id,
                betType: $scope.filter.betType.id,
                minBets: $scope.filter.minBets.id
            };

            function cb(err, leaderboard){
                $scope.leaderboard = leaderboard;
                setPages();
                updateRank();
            }

            Leaderboard.getLeaderboard(query, cb);
        };

        function setBetTypes(betTypeArray){
            $scope.filters.betTypes = [{name:'All Bet Types', id: 'all'}];
            for(var i=0; i<betTypeArray.length; i++){
                $scope.filters.betTypes.push({id:betTypeArray[i], name:betTypeArray[i]});
            }
            $scope.filter.betType = $scope.filters.betTypes[0];
        }

        function setBetDurations(betDurationArray){
            $scope.filters.betDurations = [{name: 'All Periods', id: 'all'}];
            for(var i=0; i<betDurationArray.length; i++){
                $scope.filters.betDurations.push({id:betDurationArray[i], name:betDurationArray[i]});
            }
            $scope.filter.betDuration = $scope.filters.betDurations[0];
        }

        function updateBetTypes(){
            if($scope.filter.league._id !== 'all'){
                setBetTypes($scope.filter.league.betTypes);
            } else if($scope.filter.sport._id !== 'all'){
                setBetTypes($scope.filter.sport.betTypes);
            }
        }

        function updateBetDurations(){
            if($scope.filter.league._id !== 'all'){
                setBetDurations($scope.filter.league.betDurations);
            } else if($scope.filter.sport._id !== 'all'){
                setBetDurations($scope.filter.sport.betDurations);
            }

        }


        function selectSportDropdown(){
            var selectedSport = $filter('filter')($scope.filters.sports, function(sport){
                return sport.slug === $scope.sportSlug;
            });
            if(selectedSport.length){
                $scope.filter.sport = $scope.filters.sports[$scope.filters.sports.indexOf(selectedSport[0])];
            } else {
                $scope.filter.sport = $scope.filters.sports[0];
            }
        }



        function selectLeagueDropdown(){
            var selectedLeague = $filter('filter')($scope.filters.leagues, function(league){
                return league.slug === $scope.leagueSlug;
            });
            if(selectedLeague.length){
                $scope.filter.league = $scope.filters.leagues[$scope.filters.leagues.indexOf(selectedLeague[0])];
            } else {
                $scope.filter.league = $scope.filters.leagues[0];
            }
        }

        function selectContestantDropdown(){
            var selectedContestant = $filter('filter')($scope.filters.contestants, function(contestant){
                return contestant.slug === $scope.contestantSlug;
            });
            if(selectedContestant.length){
                $scope.filter.contestant = $scope.filters.contestants[$scope.filters.contestants.indexOf(selectedContestant[0])];
            } else {
                $scope.filter.contestant = $scope.filters.contestants[0];
            }
        }


        function cbGetContestants(err, contestants){
            $scope.filters.contestants = $scope.filters.contestants.concat(contestants);
            if($scope.contestantSlug){
                selectContestantDropdown();
            } else {
                updateBetTypes();
                updateBetDurations();
                $scope.updateLeaderboard();
            }
        }


        function cbGetLeagues(err, leagues){
            $scope.filters.leagues = $scope.filters.leagues.concat(leagues);
            if($scope.leagueSlug){
                selectLeagueDropdown();
                var leagueId =  $scope.filter.league._id;
                Leaderboard.getContestants(leagueId, cbGetContestants);
            } else {
                updateBetTypes();
                updateBetDurations();
                $scope.updateLeaderboard();
            }
        }


        function cbGetSports(err, sports){
            $scope.filters.sports = $scope.filters.sports.concat(sports);
            if($scope.sportSlug){
                 selectSportDropdown();
                 var sportId =  $scope.filter.sport._id;
                 var dateId = $scope.filter.date.id;
                 Leaderboard.getLeagues(sportId, dateId, cbGetLeagues);
            } else {
                $scope.updateLeaderboard();
            }
        }


        Leaderboard.getSports(cbGetSports);


        function setPages(){
            $scope.totalItems = $scope.leaderboard.length;
            $scope.currentPage = 1;
            $scope.pageSize = 10;
            $scope.maxSize = 5;
        }

        $scope.order = 'profit';
        $scope.updateOrder = function(field){
            $scope.order = field;
            updateRank();
        };

        $scope.currentOrder = function(user){
            return -user[$scope.order];
        };

        $scope.rank = 'N/A';

        function updateRank(){
            var rankFound = false;
            $scope.leaderboard = $filter('orderBy')($scope.leaderboard, $scope.currentOrder);
            for(var i=0; i<$scope.leaderboard.length; i++){
                if($scope.authentication.user._id === $scope.leaderboard[i]._id._id){
                    $scope.rank = i+1;
                    rankFound = true;
                }
            }
            if(!rankFound) $scope.rank = 'N/A';
        }

    }

]);
