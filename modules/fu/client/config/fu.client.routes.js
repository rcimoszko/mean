'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/fu/client/views/home.client.view.html'
            })
            .state('discover', {
                url: '/discover',
                templateUrl: 'modules/fu/client/views/discover.client.view.html'
            })
            .state('channel', {
                url: '/channel/:channelSlug',
                templateUrl: 'modules/fu/client/views/channel.client.view.html',
                data: {
                    roles: ['user']
                }
            });

    }
]);
