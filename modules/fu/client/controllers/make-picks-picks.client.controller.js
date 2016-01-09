'use strict';

angular.module('fu').controller('MakePicksController', ['$scope', '$stateParams', 'Authentication', 'MakePicks', '$filter',
    function ($scope, $stateParams, Authentication, MakePicks, $filter) {
        $scope.authentication = Authentication;

        $scope.query = {};
        $scope.leagueSlug = $stateParams.leagueSlug;
        /*
        $scope.sub1Slug = $stateParams.sub1Slug;
        $scope.sub2Slug = $stateParams.sub2Slug;

        $scope.menu = MakePicks.menu;


        function getEvents(query){
            function cbGetEvents(err, events){
                console.log(events);
                if(!err) $scope.events = events;
            }

            MakePicks.getEvents(query, cbGetEvents);
        }


        function getLeagueId(){
            var sport = $filter('filter')($scope.menu, {slug: $scope.sportSlug});
            var league = $filter('filter')(sport[0].main, {slug: $scope.sub1Slug});
            if(!league[0].abstract) return league[0]._id;
            if($scope.sub2Slug){
                league = $filter('filter')(league[0].main, {slug: $scope.sub2Slug});
                return league[0]._id;
            }


        }

        $scope.getEvents = function(){

            var query = {};
            if($scope.sub1Slug || $scope.sub2Slug){
                var leagueId = getLeagueId();

                if(leagueId){
                    query['league.ref'] = leagueId;
                    getEvents(query);
                }
            }
        };


        if($scope.menu.length){
            $scope.getEvents();
        }
        */

    }
]);
