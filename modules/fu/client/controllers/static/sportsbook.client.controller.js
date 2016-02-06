'use strict';

angular.module('core').controller('SportsbookController', ['$scope', '$stateParams', '$filter', '$state', 'Page', 'Location', 'SportsbookService',
    function($scope, $stateParams, $filter,  $state, Page, Location, SportsbookService) {

        $scope.sportsbookName = $stateParams.name;

        if($scope.sportsbookName){
            //If sportsbook name, Review Page
            $scope.sportsbook = SportsbookService.getSportsbook($scope.sportsbookName.replace('-',' '));
            if(!$scope.sportsbook){
                $state.go('404');
            }
        } else {
            //No sportsbook name, top 10 page
            SportsbookService.getSportsbooks(function(sportsbooks){
                $scope.sportsbooks = sportsbooks;
            });
        }

        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            if($scope.sportsbookName){
                Page.setTitle($scope.sportsbookName.replace('-', ' ')+' Review | FansUnite');
                Page.setDescription($scope.sportsbookName.replace('-', ' ')+' review from FansUnite.');
                Page.setKeywords($scope.sportsbookName+' review, '+$scope.sportsbookName+' betting offers, '+$scope.sportsbookName+' free bets');
            }
        });

        $scope.location = Location;

    }
]);