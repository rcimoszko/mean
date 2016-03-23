'use strict';

angular.module('fu').controller('ModalProfileFollowersController', ['$scope', '$modalInstance', 'userId', 'Modal', 'Users',
    function($scope, $modalInstance, userId, Modal, Users) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        function cb(err, followers){
            $scope.followersList = followers;
        }

        Users.getFollowers(userId, cb);
    }
]);

