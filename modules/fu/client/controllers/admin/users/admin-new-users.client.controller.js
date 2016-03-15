'use strict';

angular.module('fu.admin').controller('AdminNewUsersController', ['$scope', 'Users',
    function ($scope, Users) {

        function cb(err, users){
            console.log(users);
            $scope.users = users;
        }

        Users.getNew(cb);


        $scope.unverifiedFilter = false;
        $scope.trialFilter = false;
        $scope.trialEndFilter = false;
        $scope.premiumFilter = false;
        $scope.pickMadeFilter = false;

        $scope.activeFilter = function(user){
            if($scope.unverifiedFilter && user.verified)return false;
            if($scope.trialFilter && !user.trial) return false;
            if($scope.trialEndFilter && !user.trialUsed) return false;
            if($scope.premiumFilter && !user.premium) return false;
            if($scope.pickMadeFilter && !user.pickMade) return false;
            return true;
        };

    }
]);
