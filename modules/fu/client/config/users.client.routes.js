'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/fu/client/views/users/login.client.view.html',
                title: 'Login | FansUnite'
            })
            .state('signup', {
                url: '/signup?redirect',
                templateUrl: 'modules/fu/client/views/users/signup.client.view.html',
                title: 'Sign Up | FansUnite'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'modules/fu/client/views/users/settings.client.view.html',
                data: {
                    roles: ['user']
                },
                title: 'My Settings | Betting Tips, Free Picks, Odds and Scores'
            })
            .state('myFollowing', {
                url: '/my-following',
                templateUrl: 'modules/fu/client/views/users/my-following.client.view.html',
                data: {
                    roles: ['user']
                },
                title: 'My Handicappers | FansUnite',
                description : '',
                keywords: ''
            });
    }
]);
