'use strict';

angular.module('core').controller('MainController', ['$scope', 'Authentication',
    function ($scope, Authentication) {

        $scope.authentication = Authentication;
    }
]);
