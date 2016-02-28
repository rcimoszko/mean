'use strict';

angular.module('articles').controller('BlogHomeController', ['$scope', 'Articles',
    function ($scope, Articles) {

        function cb(err, articles){
            $scope.articles = articles;
        }

        Articles.getAll(cb);

    }
]);
