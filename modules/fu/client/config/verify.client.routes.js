'use strict';

angular.module('fu').config(['$stateProvider',
    function ($stateProvider) {
        $stateProvider.
        state('verifyEmailSuccess', {
            url: '/verify-email-success',
            templateUrl: 'modules/fu/client/views/email/verify-email-success.client.view.html',
            title: 'Thank You Verifying your Email | FansUnite'
        }).
        state('verifyEmailSuccessUsername', {
            url: '/verify-email-success/:username',
            templateUrl: 'modules/fu/client/views/email/verify-email-success.client.view.html',
            title: 'Thank You Verifying your Email | FansUnite'
        }).
        state('verifyEmailFailure', {
            url: '/verify-email-failure',
            templateUrl: 'modules/fu/client/views/email/verify-email-failure.client.view.html',
            title: 'Unable to Verify Email | FansUnite'
        });
    }
]);
