'use strict';

angular.module('fu').directive('trendingCardProfit', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            user: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-cards/trending-card-profit.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});