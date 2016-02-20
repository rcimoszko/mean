'use strict';

angular.module('fu').controller('MainController', ['$scope', '$state', 'Authentication', 'User', 'Loading',
    function ($scope, $state, Authentication, User, Loading) {
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        if($scope.authentication.user && !User.info.initialized) User.initialize();
        $scope.isPicksPage = function(){
            return $state.current.name.indexOf('makePicks') !== -1;
        }
    }
]);
