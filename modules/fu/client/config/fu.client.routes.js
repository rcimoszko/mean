'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'modules/fu/client/views/home.client.view.html'
            })
            .state('hub', {
                url: '/hub',
                templateUrl: 'modules/fu/client/views/hub.client.view.html'
            })
            .state('profile', {
                url: '/profile/:username',
                templateUrl: 'modules/fu/client/views/profile.client.view.html'
            });

    }
]);
