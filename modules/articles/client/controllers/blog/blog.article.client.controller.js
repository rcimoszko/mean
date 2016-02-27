'use strict';

angular.module('articles').controller('BlogArticleController', ['$scope', '$location', 'articleResolve',
    function ($scope, $location, articleResolve) {
        $scope.article = articleResolve;
        $scope.location = $location;
    }
]);
