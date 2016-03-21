'use strict';

angular.module('fu').controller('HubController', ['$scope', 'Authentication', 'Hub', 'CommentsPreviews', 'SocketHub', 'Loading', '$filter', 'User', 'StripeService', '$timeout', 'deviceDetector',
    function ($scope, Authentication, Hub, CommentsPreviews, SocketHub, Loading, $filter, User, StripeService, $timeout, deviceDetector) {
        $scope.authentication = Authentication;
        $scope.user = User;
        $scope.loading = Loading;
        $scope.socket = SocketHub;
        $scope.deviceDetector = deviceDetector;
        if($scope.socket){
            $scope.socket.connect();
        }

        /**
         * General Hub Info
         */

        function cbGetHub(err, hub){
            $scope.loading.isLoading.pageLoading = false;
            $scope.hub = hub;
            $scope.disableScroll = false;
            setPages();
            updateRank();
            if(!$scope.authentication.user.hubWalkthrough && $scope.deviceDetector.isDesktop()) $timeout($scope.startHubWalkthrough, 1000);
        }
        $scope.loading.isLoading.pageLoading = true;
        Hub.getHub(cbGetHub);

        /**
         * Picks Feed
         */

        $scope.picks = {
            all:{
                pending: [],
                "in play": [],
                completed: []
            },
            pro: {
                pending: [],
                "in play": [],
                completed: []
            }
        };

        $scope.pages = {
            all:{
                pending: 0,
                "in play": 0,
                completed: 0
            },
            pro: {
                pending: 0,
                "in play": 0,
                completed: 0
            }
        };

        $scope.tab = 'all';


        $scope.pickFilters = ['pending', 'in play', 'completed'];
        $scope.pickFilter = $scope.pickFilters[0];
        $scope.setPickFilter = function(pickFilter){
        };

        $scope.filterChange = function(pickFilter){
            $scope.pickFilter = pickFilter;
            if($scope.picks[$scope.tab][$scope.pickFilter].length === 0){
                $scope.getPicks();
            }
        };
        $scope.tabChange = function(tab){
            $scope.tab = tab;
            if($scope.picks[$scope.tab][$scope.pickFilter].length === 0){
                $scope.getPicks();
            }
        };

        $scope.getPicks = function(){
            function cbGetPicks(err, picks){
                $scope.picks[$scope.tab][$scope.pickFilter] = $scope.picks[$scope.tab][$scope.pickFilter].concat(picks);
                $scope.pages[$scope.tab][$scope.pickFilter]++;
                $scope.disableScroll = false;
            }

            var query = {
                page: $scope.pages[$scope.tab][$scope.pickFilter],
                type: $scope.pickFilter
            };
            if($scope.tab === 'pro') query.pro = true;
            $scope.disableScroll = true;
            Hub.getPicks(query, cbGetPicks);
        };

        //$scope.getPicks();
        $scope.disableScroll = true;

        $scope.getMorePicks = function(){
            if(!$scope.disableScroll){
                $scope.disableScroll = true;
                $scope.getPicks();
            }
        };

        /**
         * Talk
         */


        $scope.getTalk = function(){
            var query = {
                sportId: 'all',
                leagueId: 'all',
                count: 5
            };

            function cb(err, previews){
                $scope.previews = previews;
            }

            CommentsPreviews.getPreviews(query, cb);
        };
        $scope.getTalk();

        /**
         * Leaderboard
         */


        function setPages(){
            $scope.totalItems = $scope.hub.leaderboard.length;
            $scope.currentPage = 1;
            $scope.pageSize = 5;
            $scope.maxSize = 0;
        }

        $scope.rank = 'N/A';

        function updateRank(){
            var rankFound = false;
            var leaderboard = $filter('orderBy')($scope.hub.leaderboard, 'profit', true);

            for(var i=0; i<leaderboard.length; i++){
                if($scope.authentication.user._id === leaderboard[i].user._id){
                    $scope.rank = i+1;
                    rankFound = true;
                }
            }
            if(!rankFound) $scope.rank = 'N/A';

        }

        $scope.showSubscriptionModal = function(){
            StripeService.showSubscriptionModal();
        };

        /**
         * Walkthrough
         */

        $scope.CompletedHubWalkthrough  = function () {
            $scope.authentication.user.hubWalkthrough = true;
            User.update(function(err){});
        };

        $scope.ExitHubWalkthrough = function () {
            $scope.authentication.user.hubWalkthrough = true;
            User.update(function(err){});
        };

        $scope.HubIntroOptions = {
            steps:[
                {
                    element: '#hub-step1',
                    intro: 'Find upcoming picks from the community',
                    position: 'right'
                },
                {
                    element: '#hub-step2',
                    intro: "Find the most popular games and picks",
                    position: 'right'
                },
                {
                    element: '#hub-step3',
                    intro: "See what our community is discussing",
                    position: 'top'
                },
                {
                    element: '#hub-step4',
                    intro: "Find trending handicappers",
                    position: 'left'
                }
            ],
            showStepNumbers: false,
            scrollToElement: false,
            exitOnEsc:true,
            exitOnOverlayClick: false,
            nextLabel: 'NEXT',
            prevLabel: 'PREV',
            skipLabel: 'EXIT',
            doneLabel: 'Thanks',
            showBullets: false
        };



    }
]);
