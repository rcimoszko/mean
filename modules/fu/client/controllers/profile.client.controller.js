'use strict';

angular.module('fu').controller('ProfileController', ['$scope', '$stateParams', 'Users',
    function ($scope, $stateParams, Users) {
        $scope.username = $stateParams.username;

        function cbGetProfile(err, profile){
            console.log(profile);
            if(!err) $scope.profile = profile;
        }

        Users.getProfile($scope.username, cbGetProfile);

    }
]);
