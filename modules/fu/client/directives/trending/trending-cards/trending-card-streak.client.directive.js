'use strict';

angular.module('fu').directive('trendingCardStreak', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            user: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-cards/trending-card-streak.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});