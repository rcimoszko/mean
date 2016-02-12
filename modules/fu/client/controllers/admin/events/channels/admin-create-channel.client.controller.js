'use strict';

angular.module('fu.admin').controller('AdminCreateChannelController', ['$scope', 'Channels', 'Sports', 'Leagues', '$state',
    function ($scope, Channels, Sports, Leagues, $state) {
        $scope.channel = {};

        function cb(err, sports){
            $scope.sports = sports;
        }

        Sports.getAll(cb);

        $scope.submit = function(){

            function cb(err, channel){
                if(err){
                    $scope.error = err;
                } else{
                    $scope.channel = channel;
                    $state.go('admin.editChannel',{channelId: $scope.channel._id});
                }
            }
            Channels.create($scope.channel, cb);

        };
    }
]);
