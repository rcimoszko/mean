'use strict';

angular.module('fu').controller('MainController', ['$scope', 'Authentication', 'User',
    function ($scope, Authentication, User) {
        $scope.authentication = Authentication;
        if($scope.authentication.user && !User.info.initialized) User.initialize();
    }
]);
