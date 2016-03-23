'use strict';

angular.module('fu').controller('ModalProfileFollowingController', ['$scope', '$modalInstance', 'userId', 'Modal', 'Users',
    function($scope, $modalInstance, userId, Modal, Users) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        function cb(err, following){
            $scope.followingList = following;
        }

        Users.getFollowing(userId, cb);
    }
]);

