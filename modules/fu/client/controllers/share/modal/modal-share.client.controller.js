'use strict';

angular.module('fu').controller('ModalShareController', ['$scope', 'type', 'pick', 'event',
    function($scope, type, pick, event) {
        $scope.type = type;
        $scope.pick = pick;
        $scope.event = event;
    }
]);