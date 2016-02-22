'use strict';

angular.module('fu.admin').controller('AdminEditEventController', ['$scope', 'contestantResolve', 'Events', '$state',
    function ($scope, eventResolve, Events, $state) {
        $scope.event = eventResolve;

        $scope.submit = function(){
            function cb(err, contestant){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.event = contestant;
                    $state.go('admin.events');
                }
            }
            Events.update($scope.event, cb);

        };
    }
]);
