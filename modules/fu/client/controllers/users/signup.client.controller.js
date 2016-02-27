'use strict';

angular.module('fu').controller('SignupController', ['$scope', 'Authentication',
    function ($scope, Authentication) {
        $scope.authentication = Authentication;


    }
]);
