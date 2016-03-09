'use strict';

angular.module('core').controller('SportsbookController', ['$scope', '$stateParams', '$filter', '$state', 'Page', 'Location', 'SportsbookService',
    function($scope, $stateParams, $filter,  $state, Page, Location, SportsbookService) {

        $scope.sportsbookName = $stateParams.name;

        if($scope.sportsbookName){
            //If sportsbook name, Review Page
            $scope.sportsbook = SportsbookService.getSportsbook($scope.sportsbookName.replace('-',' '));
            Page.meta.title = $scope.sportsbookName.replace('-', ' ')+' Review | FansUnite' ;
            Page.meta.description = $scope.sportsbookName.replace('-', ' ')+' review from FansUnite.';
            Page.meta.keywords = $scope.sportsbookName+' review, '+$scope.sportsbookName+' betting offers, '+$scope.sportsbookName+' free bets';

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
            Page.meta.title = $scope.sportsbookName.replace('-', ' ')+' Review | FansUnite';
            Page.meta.description = $scope.sportsbookName.replace('-', ' ')+' review from FansUnite.';
            Page.meta.keywords = $scope.sportsbookName+' review, '+$scope.sportsbookName+' betting offers, '+$scope.sportsbookName+' free bets';

        });

        $scope.location = Location;

    }
]);