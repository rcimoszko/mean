'use strict';

angular.module('fu.admin').controller('AdminHomeController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;
    }
]);
