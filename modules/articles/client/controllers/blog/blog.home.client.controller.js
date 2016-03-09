'use strict';

angular.module('articles').controller('BlogHomeController', ['$scope', 'Articles', 'Loading',
    function ($scope, Articles, Loading) {
        $scope.loading = Loading;

        function cb(err, articles){
            $scope.articles = articles;
            $scope.loading.isLoading.pageLoading = false;
        }

        $scope.loading.isLoading.pageLoading = true;
        Articles.getAll(cb);

    }
]);
