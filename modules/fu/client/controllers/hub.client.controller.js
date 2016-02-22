'use strict';

angular.module('fu').controller('HubController', ['$scope', 'Authentication', 'Hub', 'CommentsPreviews', 'SocketHub', 'Loading',
    function ($scope, Authentication, Hub, CommentsPreviews, SocketHub, Loading) {
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.socket = SocketHub;
        if($scope.socket){
            $scope.socket.connect();
        }

        /**
         * General Hub Info
         */

        function cbGetHub(err, hub){
            $scope.loading.isLoading.pageLoading = false;
            $scope.hub = hub;
        }
        $scope.loading.isLoading.pageLoading = true;
        Hub.getHub(cbGetHub);

        /**
         * Picks Feed
         */

        $scope.picks = {
            all:{
                pending: [],
                completed: []
            },
            pro: {
                pending: [],
                completed: []
            }
        };

        $scope.pages = {
            all:{
                pending: 0,
                completed: 0
            },
            pro: {
                pending: 0,
                completed: 0
            }
        };

        $scope.tab = 'all';


        $scope.pickFilters = ['pending', 'completed'];
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

        $scope.getPicks();
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
                console.log(previews);
                $scope.previews = previews;
            }

            CommentsPreviews.getPreviews(query, cb);
        };
        $scope.getTalk();



    }
]);
