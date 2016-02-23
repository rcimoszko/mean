'use strict';

angular.module('articles').controller('AdminListArticlesController', ['$scope', 'Articles',
    function ($scope, Articles) {

        function cb(err, articles){
            $scope.articles = articles;
        }

        Articles.getAll(cb);

    }
]);
