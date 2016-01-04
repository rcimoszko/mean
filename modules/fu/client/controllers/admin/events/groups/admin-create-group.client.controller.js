'use strict';

angular.module('fu.admin').controller('AdminCreateGroupController', ['$scope', 'Groups', 'Sports', '$state',
    function ($scope, Groups, Sports, $state) {
        $scope.group = {};

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.submit = function(){

            function cb(err, group){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.group = group;
                    $state.go('admin.editGroup',{groupId: $scope.group._id});
                }
            }
            Groups.create($scope.group, cb);

        };
    }
]);
