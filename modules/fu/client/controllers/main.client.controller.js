'use strict';

angular.module('fu').controller('MainController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
