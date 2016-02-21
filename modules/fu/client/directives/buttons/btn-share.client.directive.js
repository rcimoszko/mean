'use strict';

angular.module('fu').directive('btnShare', function () {
    return {
        restrict: 'E',
        scope: {
            pick: '=',
            event: '='
        },
        templateUrl: 'modules/fu/client/templates/buttons/btn-share.client.template.html',
        controller: ['$scope', 'Modal', function ($scope, Modal) {
            $scope.sharePick = function() {
                Modal.showModal(
                    '/modules/fu/client/views/share/modal/modal-share.client.view.html',
                    'ModalShareController', {
                        type: function () {
                            return 'pick';
                        },
                        pick: function () {
                            return $scope.pick;
                        },
                        event: function () {
                            return $scope.event;
                        }
                    }, 'share');
            };
        }]
    };
});