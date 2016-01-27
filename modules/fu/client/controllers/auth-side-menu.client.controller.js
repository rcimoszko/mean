'use strict';

angular.module('fu').controller('AuthSideMenuController', ['$scope', 'Modal',
    function ($scope, Modal) {
        $scope.showMyPicks = function(){
            Modal.showModal(
                '/modules/fu/client/views/users/modal/modal-my-picks.client.view.html',
                'ModalMyPicksController',
                {},
                'my-picks'
            );
        };

    }
]);
