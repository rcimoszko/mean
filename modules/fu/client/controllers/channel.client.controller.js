'use strict';

angular.module('fu').controller('ChannelController', ['$scope', '$stateParams', 'Authentication', 'Channels',
    function ($scope, $stateParams, Authentication, Channels) {
        $scope.channelSlug = $stateParams.channelSlug;
        $scope.authentication = Authentication;

        function cb(err, channelContent){
            console.log(channelContent);
            $scope.channelContent = channelContent;
        }

        Channels.getContent($scope.channelSlug, cb);


        /*
        Channels.getEvents($scope.channelSlug, date, callback);
        */
    }
]);
