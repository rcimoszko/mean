'use strict';

angular.module('fu').directive('makePicks', function () {
    return {
        restrict: 'E',
        scope: {
            event: '=',
            betTypes: '=',
            columns: '=',
            activeBetType: '='
        },
        templateUrl: 'modules/fu/client/templates/make-picks/make-picks.client.template.html',
        controller: ['$scope', function ($scope){
            $scope.contestant1 = $scope.event.contestant1.ref;
            $scope.contestant2 = $scope.event.contestant2.ref;

            $scope.mainBets = $scope.event.bets.main;

        }]
    };
});