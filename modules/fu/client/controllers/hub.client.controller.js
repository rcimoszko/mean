'use strict';

angular.module('fu').controller('HubController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
