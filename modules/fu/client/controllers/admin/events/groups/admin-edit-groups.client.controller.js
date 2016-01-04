'use strict';

angular.module('fu.admin').controller('AdminEditGroupController', ['$scope', 'groupResolve', 'Groups', 'Sports', '$state',
    function ($scope, groupResolve, Groups, Sports, $state) {
        $scope.group = groupResolve;

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
                    $state.go('admin.groups');
                }
            }
            Groups.update($scope.group, cb);

        };
    }
]);
