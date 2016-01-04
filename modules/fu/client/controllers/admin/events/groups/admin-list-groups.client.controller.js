'use strict';

angular.module('fu.admin').controller('AdminListGroupsController', ['$scope', 'Sports',
    function ($scope, Sports) {

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.getGroups = function(){
            function cb(err, groups){
                $scope.groups = groups;
            }
            Sports.getGroups($scope.sport._id, cb);
        };

    }
]);
