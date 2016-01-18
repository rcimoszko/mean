'use strict';

angular.module('fu').controller('MakePicksPicksController', ['$scope', '$stateParams', 'Authentication', 'MakePicks',
    function ($scope, $stateParams, Authentication, MakePicks) {
        $scope.authentication = Authentication;

        $scope.query = {};
        $scope.leagueSlug = $stateParams.leagueSlug;
        $scope.sportSlug = $stateParams.sportSlug;

        $scope.menu = MakePicks.menu;
        $scope.makePicks = MakePicks;

        $scope.setActiveBetType = function(betType){
            $scope.activeBetType = betType;
        };
        $scope.setActiveBetDuration = function(betDuration){
            $scope.activeBetDuration = betDuration;
        };

        function getEvents(query){
            function cbGetEvents(err, results){
                console.log(results);
                if(!err){
                    $scope.events = results.events;
                    $scope.betTypes = results.betTypes;
                    if($scope.betTypes.length) $scope.activeBetType = $scope.betTypes[0];
                    $scope.betDurations = results.betDurations;
                    if($scope.betDurations.length) $scope.activeBetDuration = $scope.betDurations[0];
                    $scope.columns = $scope.betTypes.length;
                    if($scope.betTypes.indexOf('team totals') !== - 1) $scope.columns++;
                }
            }
            MakePicks.getEvents(query, cbGetEvents);
        }


        $scope.getEvents = function(){
            var query = {};
            if(MakePicks.active.league){
                query.leagueId = MakePicks.active.league._id;
                getEvents(query);
            }
        };

        $scope.$on('menuSet', function() {
            $scope.getEvents();
        });


        if($scope.menu.length){
            $scope.getEvents();
        }

        $scope.toggleMenu = function(){
            $scope.$emit('toggleMenu');
        };
    }
]);
