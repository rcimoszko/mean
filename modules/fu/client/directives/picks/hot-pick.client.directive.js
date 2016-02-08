'use strict';

angular.module('fu').directive('hotPick', function () {
    return {
        restrict: 'E',
        scope: {
            hotPick: '='
        },
        templateUrl: 'modules/fu/client/templates/picks/hot-pick.client.template.html',
        controller: ['$scope', '$filter', function ($scope, $filter){
            console.log($scope.hotPick.pick.betType);
            switch($scope.hotPick.pick.betType){
                case 'moneyline':
                    $scope.value = $filter('formatOdds')($scope.hotPick.pick.value);
                    break;
                case 'spread':
                    $scope.value = $filter('formatSpread')($scope.hotPick.pick.value);
                    break;
                case 'total points':
                    $scope.value = $filter('formatPoints')($scope.hotPick.pick.value);
                    break;
            }
        }]
    };
});