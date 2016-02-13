'use strict';

angular.module('fu').controller('ChannelController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Channels',
    function ($scope, $state, $stateParams, $location, Authentication, Channels) {

        $scope.date = $stateParams.date;
        $scope.channelSlug = $stateParams.channelSlug;
        $scope.authentication = Authentication;
        $scope.loading = true;

        function setDate(date){
            $scope.currentDate = new Date(date);
            $scope.yesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 1);
            $scope.dayBeforeYesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 2);
            $scope.tomorrow = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + 1);
        }

        console.log('refresh controller');

        if($scope.date){
            if(!moment($scope.date, "YYYY-MM-DD", true).isValid()) $state.go('channel', {channelSlug:$scope.channelSlug });
            var date = $scope.date.split('-');
            date = new Date(date[0], date[1]-1, date[2]);
            setDate(date);
        }

        function cb(err, channelContent){
            console.log(channelContent);
            $scope.loading = false;
            $scope.channelContent = channelContent;
            $scope.channel = channelContent.channel;
            if(!$scope.date){
                switch($scope.channel.dateGroup){
                    case 'upcoming':
                        $scope.upcoming = true;
                        setDate( new Date());
                        break;
                    case 'daily':
                        setDate( new Date());
                        break;
                    case 'weekly':
                        break;
                }
            }

        }

        Channels.getContent($scope.channelSlug, $scope.currentDate, cb);

        $scope.updateDate = function(date){
            $state.go('channel.main.date', {channelSlug:$scope.channelSlug, date:date.toISOString().substring(0, 10)});
            $scope.upcoming = false;
            setDate(date);
            $scope.getEvents();
        };

        $scope.getEvents = function(){
            $scope.eventsLoading = true;
            function cb(err, events){
                $scope.channelContent.eventGroups = events;
                $scope.eventsLoading = false;
            }
            if($scope.upcoming){
                Channels.getEvents($scope.channelSlug, null, cb);
            } else {
                Channels.getEvents($scope.channelSlug, $scope.currentDate, cb);
            }
        };

        $scope.setUpcoming = function(){
            $state.go('channel.main.home', {channelSlug:$scope.channelSlug});
            $scope.upcoming = true;
            setDate(new Date());
            $scope.getEvents();
        };

    }
]);
