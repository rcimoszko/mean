'use strict';

angular.module('fu').controller('TopMenuController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
