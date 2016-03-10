'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/fu/client/views/splash.client.view.html'
            })
            .state('hub', {
                url: '/hub',
                templateUrl: 'modules/fu/client/views/hub.client.view.html',
                title: 'Hub | FansUnite',
                description: '',
                keywords: '',
                data: {
                    roles: ['user']
                }
            })
            .state('profile', {
                url: '/profile/:username',
                templateUrl: 'modules/fu/client/views/profile.client.view.html'
            })
            .state('gamecenter', {
                url: '/game/:eventSlug/:leagueSlug',
                templateUrl: 'modules/fu/client/views/gamecenter.client.view.html'
            });

    }
]);
