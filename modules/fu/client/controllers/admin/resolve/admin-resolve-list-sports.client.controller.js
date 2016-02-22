'use strict';

angular.module('fu.admin').controller('AdminResolveListSportsController', ['$scope', 'Sports',
    function ($scope, Sports) {

        function cb(err, sports){
            console.log(sports);
            $scope.sports = sports;
        }

        Sports.getResolveList(cb);

    }
]);
