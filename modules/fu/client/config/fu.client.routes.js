'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/fu/client/views/home.client.view.html'
            })
            .state('profile', {
                url: '/profile/:username',
                templateUrl: 'modules/fu/client/views/profile.client.view.html'
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
