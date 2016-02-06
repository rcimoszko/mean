'use strict';

angular.module('fu').controller('ModalChooseChannelsController', ['$scope', '$modalInstance', 'Modal', 'Channels',
    function($scope, $modalInstance, Modal, Channels) {
        $scope.modal = Modal;
        $scope.modalInstance = $modalInstance;

        function cb(err, channels){
            $scope.channels = channels;
        }

        Channels.getAll(cb);

    }
]);

