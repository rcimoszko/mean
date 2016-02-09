'use strict';

angular.module('fu').directive('trendingTableFollows', function () {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: 'modules/fu/client/templates/trending/trending-tables/trending-table-follows.client.template.html',
        controller: ['$scope', function ($scope){
            console.log($scope.users);
        }]
    };
});