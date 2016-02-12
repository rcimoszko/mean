'use strict';

angular.module('fu.admin').controller('AdminListChannelsController', ['$scope', 'Channels',
    function ($scope, Channels) {

        function cb(err, channels){
            $scope.channels = channels;
        }

        Channels.getAll(cb);

    }
]);
