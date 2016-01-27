'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/fu/client/views/users/login.client.view.html'
            })
            .state('signup', {
                url: '/signup',
                templateUrl: 'modules/fu/client/views/users/signup.client.view.html'
            })
                .state('myHub', {
                    url: '/hub',
                    templateUrl: 'modules/fu/client/views/users/my-hub.client.view.html',
                    data: {
                        roles: ['user']
                    }
                })
                .state('myProfile', {
                    url: '/my-profile',
                    templateUrl: 'modules/fu/client/views/users/my-profile.client.view.html',
                    data: {
                        roles: ['user']
                    }
                })
                .state('myTracker', {
                    url: '/my-picks',
                    templateUrl: 'modules/fu/client/views/users/my-tracker.client.view.html',
                    data: {
                        roles: ['user']
                    }
                })
                .state('myFollowing', {
                    url: '/my-following',
                    templateUrl: 'modules/fu/client/views/users/my-following.client.view.html',
                    data: {
                        roles: ['user']
                    }
                });

    }
]);
