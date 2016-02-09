'use strict';

angular.module('fu').directive('trendingTableStreak', function () {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-tables/trending-table-streak.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});