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
                url: '/signup',
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
                    title: 'My Tipsters | Verified Record and History'
                }).
            state('signupSuccess', {
                url: '/signup-success',
                templateUrl: 'modules/users/views/signup/signup-success.client.view.html'
            }).
            state('signupSuccessUsername', {
                url: '/signup-success/:username',
                templateUrl: 'modules/users/views/signup/signup-success.client.view.html'
            }).
            state('verifyEmailSuccess', {
                url: '/verify-email-success',
                templateUrl: 'modules/users/views/email/verify-email-success.client.view.html'
            }).
            state('verifyEmailSuccessUsername', {
                url: '/verify-email-success/:username',
                templateUrl: 'modules/users/views/email/verify-email-success.client.view.html'
            }).
            state('verifyEmailFailure', {
                url: '/verify-email-failure',
                templateUrl: 'modules/users/views/email/verify-email-failure.client.view.html'
            });

    }
]);
