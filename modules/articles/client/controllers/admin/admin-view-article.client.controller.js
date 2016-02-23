'use strict';

angular.module('articles').controller('AdminViewArticleController', ['$scope', 'articleResolve', 'Articles',
    function ($scope, articleResolve, Articles) {

        $scope.article = articleResolve;

    }
]);
