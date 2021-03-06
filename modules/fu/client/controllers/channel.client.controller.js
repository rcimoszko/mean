'use strict';

angular.module('fu').controller('ChannelController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Channels', 'SocketChannel', 'Loading', 'Page',
    function ($scope, $state, $stateParams, $location, Authentication, Channels, SocketChannel, Loading, Page) {

        $scope.date = $stateParams.date;
        $scope.channelSlug = $stateParams.channelSlug;
        $scope.authentication = Authentication;
        $scope.loading = Loading;
        $scope.location = $location;

        function setDate(date){
            $scope.currentDate = new Date(date);
            $scope.currentDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate());
            $scope.yesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 1);
            $scope.dayBeforeYesterday = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - 2);
            $scope.tomorrow = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + 1);
        }

        if($scope.date){
            if(!moment($scope.date, "YYYY-MM-DD", true).isValid()) $state.go('channel', {channelSlug:$scope.channelSlug });
            var date = $scope.date.split('-');
            date = new Date(date[0], date[1]-1, date[2]);
            setDate(date);
        } else {
            setDate( new Date());
        }

        function setupSocket(){
            $scope.socket = SocketChannel;
            if($scope.socket){
                $scope.socket.connect();
            }
            $scope.socket.emit('join channel', $scope.channel._id);
        }

        function updateMetaData(){
            Page.meta.title = $scope.channel.name + ' Betting Community | FansUnite';
            Page.meta.description = 'Daily '+$scope.channel.name+' betting discussions, pro picks, free tips, odds and community consensus.';
            Page.meta.keywords = $scope.channel.name+' betting, '+$scope.channel.name+' pro picks, '+$scope.channel.name+' free tips, '+$scope.channel.name+' odds, '+$scope.channel.name+' consensus';
        }

        function cb(err, channelContent){
            if(!channelContent) $state.go('not-found');
            $scope.loading.isLoading.pageLoading = false;
            $scope.channelContent = channelContent;
            $scope.channel = channelContent.channel;
            setupSocket();
            updateMetaData();

            if(!$scope.date){
                switch($scope.channel.dateGroup){
                    case 'upcoming':
                        $scope.upcoming = true;
                        break;
                    case 'daily':
                        break;
                    case 'weekly':
                        break;
                }
            }

        }

        $scope.loading.isLoading.pageLoading = true;
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
