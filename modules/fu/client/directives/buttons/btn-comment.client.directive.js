'use strict';

angular.module('fu').directive('btnComment', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-comment.client.template.html',
        controller: ['$scope', 'Modal', function ($scope, Modal) {
            $scope.showCommentModal = function () {
                Modal.showModal(
                    '/modules/fu/client/views/pick/modal/modal-pick-comment.client.view.html',
                    'ModalPickCommentController', {
                        pick: function () {
                            return $scope.pick;
                        }
                    },
                    'pick-comment'
                );
            };
        }]
    };
});