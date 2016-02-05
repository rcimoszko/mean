'use strict';

angular.module('fu').directive('trendingCardFollows', function () {
    return {
        restrict: 'E',
        scope: {
            value: '=',
            user: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-cards/trending-card-follows.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});