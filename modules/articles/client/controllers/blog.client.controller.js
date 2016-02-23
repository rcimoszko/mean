'use strict';

angular.module('articles').controller('BlogController', ['$scope', 'Articles', '$state',
    function ($scope, Articles, $state) {


        function cb(err, articles){
            $scope.articles = articles;
        }

        Articles.getAll(cb);

    }
]);
