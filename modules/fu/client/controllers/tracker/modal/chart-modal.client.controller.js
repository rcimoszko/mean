'use strict';

angular.module('fu').controller('ChartModalController', ['$scope','$modalInstance', 'picks', 'statSummary', 'field', 'title',
    function($scope, $modalInstance, picks, statSummary, field, title) {
        $scope.picks = picks;
        $scope.statSummary = statSummary;
        $scope.field = field;
        $scope.title = title;

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

    }
]);