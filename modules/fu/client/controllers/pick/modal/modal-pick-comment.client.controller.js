'use strict';

angular.module('fu').controller('ModalPickCommentController', ['$scope', '$modalInstance', 'Modal', 'pick', 'Picks',
    function($scope, $modalInstance, Modal, pick, Picks) {
        $scope.pick = pick;
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        function cb(err, comments){
            $scope.comments = comments;
        }

        Picks.getComments($scope.pick, cb);
    }
]);

