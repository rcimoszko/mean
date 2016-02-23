'use strict';

angular.module('articles').controller('AdminCreateArticleController', ['$scope', 'Articles', '$state',
    function ($scope, Articles, $state) {
        $scope.article = {
            content: '',
            datePublished: new Date()
        };

        function cb(err, sports){
            $scope.sports = sports;
        }

        $scope.submit = function(){
            console.log($scope.article);

            function cb(err, article){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.article = article;
                    $state.go('admin.editArticle',{articleId: $scope.article._id});
                }
            }
            Articles.create($scope.article, cb);

        };
    }
]);
