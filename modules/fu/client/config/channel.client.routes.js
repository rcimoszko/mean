'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('channel', {
                url: '/channel/:channelSlug',
                templateUrl: 'modules/fu/client/views/channel.client.view.html',
                data: {
                    roles: ['user']
                }
            })
            .state('channelDate', {
                url: '/channel/:channelSlug/:date',
                templateUrl: 'modules/fu/client/views/channel.client.view.html',
                data: {
                    roles: ['user']
                }
            });

    }
]);
