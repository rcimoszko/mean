'use strict';

angular.module('fu.admin').controller('AdminEditChannelController', ['$scope', 'channelResolve', 'Channels', 'Sports', '$state',
    function ($scope, channelResolve, Channels, Sports, $state) {
        $scope.channel = channelResolve;

        $scope.dateGroups = ['upcoming', 'daily'];

        $scope.submit = function(){
            function cb(err, channel){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.channel = channel;
                    $state.go('admin.channels');
                }
            }
            Channels.update($scope.channel, cb);

        };
    }
]);
