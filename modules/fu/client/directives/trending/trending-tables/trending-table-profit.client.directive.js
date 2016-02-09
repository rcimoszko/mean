'use strict';

angular.module('fu').directive('trendingTableProfit', function () {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-tables/trending-table-profit.client.template.html',
        controller: ['$scope', function ($scope){

        }]
    };
});