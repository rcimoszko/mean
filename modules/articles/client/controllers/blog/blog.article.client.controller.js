'use strict';

angular.module('articles').controller('BlogArticleController', ['$scope', '$location', 'articleResolve', 'Page', '$state', '$filter',
    function ($scope, $location, articleResolve, Page, $state, $filter) {
        $scope.article = articleResolve;
        $scope.article.$promise.then(function(article){
        }, function(){
           $state.go('not-found');
        });
        $scope.location = $location;
        Page.meta.title = $scope.article.title+' | FansUnite Blog';
        Page.meta.description = $filter('striptags')($scope.article.content).substring(0,200);
        Page.meta.keywords = $scope.article.keywords;
    }
]);
