'use strict';

angular.module('fu').controller('ChannelController', ['$scope', '$stateParams', 'Authentication', 'Channels',
    function ($scope, $stateParams, Authentication, Channels) {
        $scope.channelSlug = $stateParams.channelSlug;
        $scope.authentication = Authentication;

        function cb(err, channel){
            $scope.channel = channel;
        }

        Channels.getContent($scope.channelSlug, cb);
    }
]);
