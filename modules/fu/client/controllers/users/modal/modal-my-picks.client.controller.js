'use strict';

angular.module('fu').controller('ModalMyPicksController', ['$scope', '$modalInstance', 'Modal', 'User',
    function ($scope, $modalInstance, Modal, User) {

        $scope.show = 'pending';
        $scope.user = User;
        $scope.completedPicks = [];
        $scope.pendingPicks = [];
        $scope.page = 1;

        function getCompletedPicks(){
            function cb(err, picks){
                if(!err) $scope.completedPicks = picks;
            }
            User.getCompletedPicks($scope.page , cb);
        }


        function getPendingPicks(){
            function cb(err, picks){
                if(!err) $scope.pendingPicks = picks;
            }
            User.getPendingPicks(cb);
        }

        getPendingPicks();

        $scope.updateShow = function(type){
            $scope.show = type;
            if(type === 'completed') getCompletedPicks();
            if(type === 'pending') getPendingPicks();
        };

    }
]);
