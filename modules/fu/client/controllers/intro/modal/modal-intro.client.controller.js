'use strict';

angular.module('fu').controller('ModalIntroController', ['$scope', '$modalInstance', 'Modal', 'Authentication', 'User',
    function($scope, $modalInstance, Modal, Authentication, User) {

        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;
        $scope.authentication = Authentication;
        $scope.slide = 1;

        $scope.nextSlide = function(goal){

            $scope.authentication.user.goal = goal;

            function cb(err){
                if(!err) $scope.slide = 2;
            }

            User.update(cb);
        };

    }
]);

