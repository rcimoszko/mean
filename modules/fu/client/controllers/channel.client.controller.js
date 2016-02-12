'use strict';

angular.module('fu').controller('ChannelController', ['$scope', '$state', '$stateParams', 'Authentication', 'Channels',
    function ($scope, $state, $stateParams, Authentication, Channels) {

        $scope.date = $stateParams.date;
        $scope.channelSlug = $stateParams.channelSlug;
        $scope.authentication = Authentication;
        $scope.loading = true;
        if($scope.date){
            if(!moment($scope.date, "YYYY-MM-DD", true).isValid()) $state.go('channel', {channelSlug:$scope.channelSlug });
            $scope.currentDate = new Date($scope.date);
            $scope.yesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 1);
            $scope.tomorrow = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + 1);
        }

        function cb(err, channelContent){
            console.log(channelContent);
            $scope.loading = false;
            $scope.channelContent = channelContent;
            $scope.channel = channelContent.channel;
            if(!$scope.currentDate){
                switch($scope.channel.dateGroup){
                    case 'upcoming':
                        $scope.currentDate = new Date();
                        $scope.yesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 1);
                        $scope.tomorrow = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + 1);
                        break;
                    case 'weekly':
                    case 'daily':
                        $scope.currentDate = new Date();
                        $scope.yesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 1);
                        $scope.tomorrow = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + 1);
                        break;
                }
            }

        }

        Channels.getContent($scope.channelSlug, $scope.currentDate, cb);


        $scope.updateDate = function(date){
            $scope.currentDate = date;
            $scope.yesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 1);
            $scope.tomorrow = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + 1);

            function cb(err, events){
                $scope.channelContent.eventGroups = events;
            }

            Channels.getEvents($scope.channelSlug, $scope.currentDate, cb);

        };

    }
]);
