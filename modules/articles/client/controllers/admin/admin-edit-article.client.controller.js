'use strict';

angular.module('articles').controller('AdminEditArticleController', ['$scope', 'articleResolve', 'Articles',
    function ($scope, articleResolve, Articles) {

        $scope.article = articleResolve;


        $scope.submit = function(){
            function cb(err, article){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.article = article;
                }
            }
            Articles.update($scope.article, cb);

        };

    }
]);
