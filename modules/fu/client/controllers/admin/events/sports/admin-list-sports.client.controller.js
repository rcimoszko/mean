'use strict';

angular.module('fu.admin').controller('AdminListSportsController', ['$scope', 'Sports',
    function ($scope, Sports) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);
    }
]);
