'use strict';

angular.module('articles').controller('BlogHomeController', ['$scope', 'Articles', '$state',
    function ($scope, Articles, $state) {

        function cb(err, articles){
            $scope.articles = articles;
        }

        Articles.getAll(cb);

    }
]);
