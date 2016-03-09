'use strict';

angular.module('articles').controller('BlogController', ['$scope', 'Articles', '$state', 'Loading',
    function ($scope, Articles, $state, Loading) {
        $scope.loading = Loading;

        function cb(err, articles){
            $scope.articles = articles;
        }

        Articles.getAll(cb);

    }
]);
