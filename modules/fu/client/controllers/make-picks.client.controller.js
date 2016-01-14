'use strict';

angular.module('fu').controller('MakePicksController', ['$scope',
    function ($scope) {

        $scope.showMenu = false;
        $scope.$on('toggleMenu', function(){
            $scope.showMenu = !$scope.showMenu;
        });

        $scope.toggleMenu = function(){
            $scope.showMenu = !$scope.showMenu;
        };
    }
]);
