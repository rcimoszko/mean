'use strict';

angular.module('fu').controller('TopMenuController', ['$scope', '$state', 'Authentication',
    function ($scope, $state, Authentication) {
        $scope.authentication = Authentication;
        $scope.state = $state;
    }
]);
