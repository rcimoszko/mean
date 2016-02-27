'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider
            .state('signupSuccess', {
                url: '/signup-success?redirect',
                templateUrl: 'modules/fu/client/views/signup/signup-success.client.view.html',
                title: 'Thank You for Signing Up | FansUnite',
                data: {
                    roles: ['user']
                }
            });
    }
]);
