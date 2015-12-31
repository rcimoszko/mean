'use strict';

angular.module('fu').controller('DiscoverController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
